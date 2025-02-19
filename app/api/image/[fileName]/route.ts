import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { readFile } from "fs/promises";

export async function GET(req: NextRequest, { params }: { params: { filename: string } }) {
  try {
    // Path to the image in /tmp
    const filePath = join("/tmp/uploads", params.filename);

    // Read the image
    const imageBuffer = await readFile(filePath);

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png", // Change based on image type
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return new NextResponse("Image not found", { status: 404 });
  }
}
