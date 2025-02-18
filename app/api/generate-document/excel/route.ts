import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";

export async function POST(req: Request) {
  let browser;
  try {
    const { html } = await req.json();

    // ✅ Use puppeteer-core in production and puppeteer in development
    const puppeteer =
      process.env.NODE_ENV === "development"
        ? await import("puppeteer")
        : await import("puppeteer-core");

    browser = await puppeteer.default.launch({
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

    const page: any = await browser.newPage();

    // ✅ Read Tailwind CSS
    const tailwindCSSPath = path.join(process.cwd(), "public", "styles.css");
    const tailwindCSS = fs.readFileSync(tailwindCSSPath, "utf8");

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
    interface TableRow {
      [index: number]: string;
    }

    tableData.forEach((row: string[], index: number) => {
      const newRow = worksheet.addRow([
        ...row,
        ...Array(maxColumns - row.length).fill(""), // Fill empty cells
      ]);

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
    if (browser) await browser.close(); // Ensure browser closes on errors
    return NextResponse.json(
      { error: "Failed to generate Excel" },
      { status: 500 }
    );
  }
}
