import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";
import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";
export async function POST(req: Request) {
  let browser;
  try {
    const { html } = await req.json();
    
    // ✅ Read Tailwind CSS
    const tailwindCSSPath = path.join(process.cwd(), "public", "styles.css");
    const tailwindCSS = fs.readFileSync(tailwindCSSPath, "utf8");
    const isLocal = process.env.NODE_ENV === "development";

    browser = await puppeteer.launch({
      args: isLocal ? [] : chromium.args,
      executablePath: isLocal
        ? (await import("puppeteer")).default.executablePath()
        : await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
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
    
    // ✅ Extract table data from the HTML
    const tableData = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll("table tr"));
      return rows.map((row) =>
        Array.from(row.querySelectorAll("td, th")).map((cell) => cell.textContent || "")
      );
    });

    console.log(tableData)
    
    await browser.close();
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");
    
    let previousCategory = ""; // Track the previous section to insert blank rows
    tableData.forEach((row) => {
      const currentCategory = row[0]?.toLowerCase().includes("loan") ? "Loan Report" :
                              row[0]?.toLowerCase().includes("default") ? "Default Report" : "General Report";
      
      if (previousCategory && previousCategory !== currentCategory) {
        worksheet.addRow([]); // Insert a blank row before a new section
      }
      worksheet.addRow(row);
      previousCategory = currentCategory;
    });
    
    worksheet.columns.forEach((column, index) => {
      const maxLength = Math.max(...tableData.map((row) => row[index]?.length || 10));
      column.width = maxLength < 15 ? 15 : maxLength + 5;
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
    if (browser) await browser.close();
    return NextResponse.json({ error: "Failed to generate Excel" }, { status: 500 });
  }
}