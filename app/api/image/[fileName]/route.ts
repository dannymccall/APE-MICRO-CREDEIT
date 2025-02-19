import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { readFile } from "fs/promises";

// Correct function signature
export async function GET(req: NextRequest) {
  try {
    // Extract params using `req.nextUrl`
    const fileName = req.nextUrl.pathname.split("/").pop();

    if (!fileName) {
      return new NextResponse("File name is required", { status: 400 });
    }

    // Path to the image in the /tmp/uploads directory
    const uploadDir = join("/tmp", "uploads");

    const filePath = join(uploadDir, fileName);

    // Read the image file
    const imageBuffer = await readFile(filePath);

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png", // Ensure the correct MIME type
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return new NextResponse("Image not found", { status: 404 });
  }
}
