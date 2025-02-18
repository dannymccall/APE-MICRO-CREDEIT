import { NextRequest, NextResponse } from "next/server";
import { getSession, deleteSession } from "@/app/lib/session/sessions";
import { cookies } from "next/headers";
import { User } from "@/app/lib/backend/models/user.model";
import { connectDB } from "@/app/lib/mongodb";
import { getUserId } from "../auth/route";
import { ActivitymanagementService } from "@/app/lib/backend/services/ActivitymanagementService";
import mongoose from "mongoose";

const activitymanagementService = new ActivitymanagementService();
export async function POST() {
  await connectDB();
  const userId = await getUserId();

  await activitymanagementService.createActivity(
    "User Logged Out",
    new mongoose.Types.ObjectId(userId)
  );
  await User.findByIdAndUpdate(userId, { online_status: "offline" });
  await deleteSession();

  return NextResponse.json({ success: true });
}
