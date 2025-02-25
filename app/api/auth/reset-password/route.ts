import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import bcrypt from "bcrypt";
import { User } from "@/app/lib/backend/models/user.model";
export async function POST(req: Request) {
  try {
    await connectDB();
    const { token, newPassword } = await req.json();

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, // Ensure it's not expired
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
