import { NextResponse } from "next/server";
import { sendEmail, EmailPayload } from "@/app/lib/serverFunctions";
import crypto from "crypto";
import { connectDB } from "@/app/lib/mongodb";
import { User } from "@/app/lib/backend/models/user.model";
export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({success: false, message: "User not found" }, { status: 404 });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiration

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
    // Send Email

    const mailOptions: EmailPayload = {
      from: '"APE CREDIT" no-reply@gmail.com', // Sender address,
      to: user.email, // Recipient address
      subject: "Password Reset", // Subject line
      text: "", // Plain text body
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 1 hour.</p>`,
    };
    await sendEmail(mailOptions);

    return NextResponse.json({success: true, message: "Reset link sent to email" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
