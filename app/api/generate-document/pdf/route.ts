import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium"; // Optimized for Vercel

// Utility to dynamically import Puppeteer
// const getPuppeteer = async () => {
//   if (process.env.NODE_ENV === "development") {
//     const puppeteer = await import("puppeteer");
//     return {
//       puppeteer: puppeteer.default,
//       executablePath: puppeteer.executablePath(),
//     };
//   } else {
//     const [puppeteerCore, chromium] = await Promise.all([
//       import("puppeteer-core"),
//       import("@sparticuz/chromium"),
//     ]);
//     return {
//       puppeteer: puppeteerCore.default,
//       executablePath: chromium.default.executablePath() || "/usr/bin/chromium",
//       args: chromium.default.args || [],
//     };
//   }
// };

export async function POST(req: Request) {
  let browser;
  try {
    const { html } = await req.json();

    const tailwindCSSPath = path.join(process.cwd(), "public", "styles.css");
    const tailwindCSS = fs.readFileSync(tailwindCSSPath, "utf8");

    const fullHtml = `
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>${tailwindCSS}</style>
        </head>
        <body class="p-6 text-gray-800">${html}</body>
      </html>
    `;
    const isLocal = process.env.NODE_ENV === "development"; // Detect environment

    browser = await puppeteer.launch({
      args: isLocal ? [] : chromium.args,
      executablePath: isLocal
        ? (await import("puppeteer")).default.executablePath() // Local Puppeteer
        : await chromium.executablePath(), // Vercel Chromium
      headless: true,
    });
    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      path: "report.pdf",
      printBackground: true,
      margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
      landscape: true,
    });

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
  } finally {
    if (browser) {
      console.log("Closing browser...");
      await browser.close();
    }
  }
}

// Helper: Retry function for Puppeteer operations
async function retry<T>(fn: () => Promise<T>, retries: number): Promise<T> {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      console.warn(`Retrying... Attempt ${attempt}`);
      if (attempt >= retries) throw error;
    }
  }
  throw new Error("Retry attempts exceeded");
}
