import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { html } = await req.json();

    let browser;
    let puppeteer;

    if (process.env.NODE_ENV === "development") {
      puppeteer = await import("puppeteer");
      browser = await puppeteer.default.launch({ headless: "new" });
    } else {
      const chrome = await import("chrome-aws-lambda");
      puppeteer = await import("puppeteer-core");

      browser = await puppeteer.default.launch({
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
      });
    }

    const page = await browser.newPage();

    // ✅ Read compiled Tailwind CSS from the output file
    const tailwindCSSPath = path.join(process.cwd(), "public", "styles.css");
    const tailwindCSS = fs.readFileSync(tailwindCSSPath, "utf8");

    // ✅ Inject compiled Tailwind CSS
    const fullHtml = `
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>${tailwindCSS}</style> <!-- ✅ Pre-compiled Tailwind -->
        </head>
        <body class="p-6 text-gray-800">
          ${html} <!-- ✅ Inject your React component -->
        </body>
      </html>
    `;

    await page.setContent(fullHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      width: "11in",
  height: "8.5in",
      margin: { 
        top: "10mm", 
       
        
      },
      landscape:true
    });

    await browser.close();

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="styled-report.pdf"',
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
