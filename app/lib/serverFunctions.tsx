"import server-only";

import { v2 as cloudinary } from "cloudinary";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";
import nodemailer, { Transporter } from "nodemailer";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string
) => {
  return new Promise(async (resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const getArrayBuffer = async (file: File): Promise<Buffer> => {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
};


export const saveFile = async (fileName: string, buffer: Buffer) => {
  try {
    // Define the directory and file path
    const uploadDir = join(process.cwd(), "public", "uploads");
    // const uploadDir = "/uploads";
    const filePath = join(uploadDir, fileName);

    // Ensure the directory exists
    await mkdir(uploadDir, { recursive: true });

    // Write the file
    await writeFile(filePath, buffer);

    console.log(`File saved to ${filePath}`);
  } catch (error) {
    console.error("Error saving file:", error);
    throw error;
  }
};


export interface EmailPayload {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(mailOptions: EmailPayload) {
  try {
    const transporter: Transporter = nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_SMTP_HOST, // e.g., 'smtp.gmail.com'
      port: parseInt(process.env.NEXT_PUBLIC_SMTP_PORT || "465", 10), // Port (default: 587)
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.NEXT_PUBLIC_SMTP_USER, // SMTP username
        pass: process.env.NEXT_PUBLIC_SMTP_PASS, // SMTP password
      },
    });

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info);
    return info;
  } catch (error: any) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
