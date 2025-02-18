import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";

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

    // ✅ Read compiled Tailwind CSS
    const tailwindCSSPath = path.join(process.cwd(), "public", "styles.css");
    const tailwindCSS = fs.readFileSync(tailwindCSSPath, "utf8");

    // ✅ Inject Tailwind CSS
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

    // ✅ Extract table data
    const tableData = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll("table tr"));
      return rows.map(row =>
        Array.from(row.querySelectorAll("td, th")).map(cell => cell.innerText)
      );
    });

    await browser.close();

    // ✅ Generate Excel file
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    // ✅ Normalize column length
    const maxColumns = Math.max(...tableData.map(row => row.length));

    tableData.forEach((row, index) => {
      const newRow = worksheet.addRow([
        ...row,
        ...Array(maxColumns - row.length).fill(""), // Fill missing columns
      ]);

      // ✅ Format "Total" rows
      if (row[0]?.toLowerCase().includes("total")) {
        newRow.eachCell(cell => {
          cell.font = { bold: true };
          cell.alignment = { horizontal: "right" };
        });
      }
    });

    // ✅ Auto-adjust column widths
    worksheet.columns.forEach(column => {
      column.width = 15;
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="report.xlsx"',
      },
    });
  } catch (error) {
    console.error("Error generating Excel:", error);
    return NextResponse.json({ error: "Failed to generate Excel" }, { status: 500 });
  }
}
