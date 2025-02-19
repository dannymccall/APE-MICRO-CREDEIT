import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { readFile } from "fs/promises";

// Correct function signature
export async function GET(req: NextRequest, context: { params: { fileName: string } }) {
  try {
    const { fileName } = context.params;

    // Path to the image in the /tmp directory
    const filePath = join("/tmp/uploads", fileName);

    // Read the image file
    const imageBuffer = await readFile(filePath);

    // Serve the image
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png", // Adjust MIME type as needed
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return new NextResponse("Image not found", { status: 404 });
  }
}
