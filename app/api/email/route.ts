import { NextRequest, NextResponse } from "next/server";
import nodemailer, { Transporter } from "nodemailer";



interface EmailPayload {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: EmailPayload = await req.json();

    const { to, subject, text, html } = body;
    // Validate the request body
    if (!to || !subject || (!text && !html)) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: to, subject, and either text or html",
        },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter: Transporter = nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_SMTP_HOST, // e.g., 'smtp.gmail.com'
      port: parseInt(process.env.NEXT_PUBLIC_SMTP_PORT || "465", 10), // Port (default: 587)
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.NEXT_PUBLIC_SMTP_USER, // SMTP username
        pass: process.env.NEXT_PUBLIC_SMTP_PASS, // SMTP password
      },
    });

    // Email options
    const mailOptions = {
      from: '"Your App" no-reply@gmail.com', // Sender address,
      to, // Recipient address
      subject, // Subject line
      text, // Plain text body
      html, // HTML body (optional)
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: "Email sent successfully",
      info,
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: error.message },
      { status: 500 }
    );
  }
}
