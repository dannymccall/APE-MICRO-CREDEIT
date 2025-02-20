import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";
import puppeteer from "puppeteer";

export async function POST(req: Request) {
  let browser;
  try {
    const { html } = await req.json();

   

    // ✅ Read Tailwind CSS
    const tailwindCSSPath = path.join(process.cwd(), "public", "styles.css");
    const tailwindCSS = fs.readFileSync(tailwindCSSPath, "utf8");
    browser = await puppeteer.launch({
      headless: true,
      executablePath:
      process.env.NEXT_PUBLIC_NODE_ENV !== "development"
        ? "/usr/bin/chromium-browser"
        : undefined,
    });

    const page = await browser.newPage();
    // ✅ Inject Tailwind CSS into the HTML
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

    await browser.close();

    // ✅ Create Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    // ✅ Determine max columns length
    const maxColumns: number = Math.max(...tableData.map((row: string[]) => row.length));

    // ✅ Populate Excel with table data
    tableData.forEach((row: string[]) => {
      const newRow = worksheet.addRow([...row, ...Array(maxColumns - row.length).fill("")]);

      // ✅ Apply bold formatting for "Total" rows
      if (row.some((cell: string) => cell.toLowerCase().includes("total"))) {
        newRow.eachCell((cell: ExcelJS.Cell) => {
          cell.font = { bold: true };
          cell.alignment = { horizontal: "right" };
        });
      }
    });

    // ✅ Auto-adjust column widths based on content
    worksheet.columns.forEach((column, index) => {
      const maxLength: number = Math.max(
        ...tableData.map((row: string[]) => row[index]?.length || 10)
      );
      column.width = maxLength < 15 ? 15 : maxLength + 5;
    });

    // ✅ Write Excel file to buffer
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
