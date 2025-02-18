import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { html } = await req.json();

    // Use puppeteer-core in production and puppeteer in development
    const puppeteer =
      process.env.NODE_ENV === "development"
        ? await import("puppeteer")
        : await import("puppeteer-core");

    const browser = await puppeteer.default.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
      executablePath:
        process.env.NODE_ENV === "development"
          ? (await import("puppeteer")).executablePath() // Local path
          : "/usr/bin/chromium", // Vercel’s Chromium path
    });

    const page = await browser.newPage();

    // ✅ Read compiled Tailwind CSS
    const tailwindCSSPath = path.join(process.cwd(), "public", "styles.css");
    const tailwindCSS = fs.readFileSync(tailwindCSSPath, "utf8");

    // ✅ Inject HTML and Tailwind CSS
    const fullHtml = `
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>${tailwindCSS}</style>
        </head>
        <body class="p-6 text-gray-800">
          ${html}
        </body>
      </html>
    `;

    await page.setContent(fullHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "a4",
      printBackground: true,
      margin: { top: "10mm", left: "10mm", right: "10mm", bottom: "10mm" },
      landscape: true,
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
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
