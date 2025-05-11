"import server-only";

import { v2 as cloudinary } from "cloudinary";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";
import nodemailer, { Transporter } from "nodemailer";
import { connectDB } from "@/app/lib/mongodb";
import { LoanApplication } from "@/app/lib/backend/models/loans.model";
import { Client } from "@/app/lib/backend/models/client.model";
import { PaymentSchedule } from "@/app/lib/backend/models/paymentSchdule.model";
import { User } from "@/app/lib/backend/models/user.model";
import { Activitymanagement } from "@/app/lib/backend/models/activitymanagement.model";
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






export async function getDashboardData() {
  await connectDB();

  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const [
    monthlyOutstandingBalance,
    monthlyDisbursement,
    totalUsers,
    totalClients,
    totalOutstandingBalance,
    totalArrears,
    totalRepayment,
    monthlyRepayment,
    totalDisbursement,
    todayRepayment,
    todayDisbursement,
    activitiesRaw,
  ] = await Promise.all([
    PaymentSchedule.aggregate([
      { $unwind: "$schedule" },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          outStandingBalance: { $sum: "$schedule.outStandingBalance" },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    LoanApplication.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalDisbursement: { $sum: "$principal" },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    User.countDocuments(),
    Client.countDocuments(),
    PaymentSchedule.aggregate([
      { $unwind: "$schedule" },
      {
        $group: {
          _id: null,
          totalOutstanding: { $sum: "$schedule.outStandingBalance" },
        },
      },
    ]),
    PaymentSchedule.aggregate([
      { $unwind: "$schedule" },
      { $match: { "schedule.status": "arrears" } },
      {
        $group: {
          _id: null,
          totalOutstanding: { $sum: "$schedule.outStandingBalance" },
        },
      },
    ]),
    PaymentSchedule.aggregate([
      { $unwind: "$schedule" },
      {
        $group: {
          _id: null,
          totalRepayment: { $sum: "$schedule.amountPaid" },
        },
      },
    ]),
    PaymentSchedule.aggregate([
      { $unwind: "$schedule" },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          monthlyRepayment: { $sum: "$schedule.amountPaid" },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    LoanApplication.aggregate([
      {
        $group: {
          _id: null,
          totalDisbursement: { $sum: "$principal" },
        },
      },
    ]),
    PaymentSchedule.aggregate([
      { $unwind: "$schedule" },
      { $match: { createdAt: { $gte: startOfDay, $lt: endOfDay } } },
      {
        $group: {
          _id: null,
          dailyRepayment: { $sum: "$schedule.amountPaid" },
        },
      },
    ]),
    LoanApplication.aggregate([
      { $match: { createdAt: { $gte: startOfDay, $lt: endOfDay } } },
      {
        $group: {
          _id: null,
          todayDisbursement: { $sum: "$principal" },
        },
      },
    ]),
    Activitymanagement.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
      { $sort: { createdAt: -1 } },
      { $limit: 5 },
    ]),
  ]);

  // 🔄 Serialize activities
  const activities = activitiesRaw.map((activity) => ({
    _id: activity._id?.toString(),
    action: activity.action,
    createdAt: activity.createdAt?.toISOString(),
    userDetails: activity.userDetails
      ? {
          _id: activity.userDetails._id?.toString(),
          first_name: activity.userDetails.first_name,
          last_name: activity.userDetails.last_name,
          email: activity.userDetails.email,
          username: activity.userDetails.username,
        }
      : null,
  }));

  interface Disbursement {
    _id: string;
    totalDisbursement: number;
  }
  
  interface Outstanding {
    _id: string;
    outStandingBalance: number;
  }
  
  interface Repayment {
    _id: string;
    monthlyRepayment: number;
  }

  const disbursementMonths: string[] = monthlyDisbursement.map(
    (disbursement: Disbursement) => disbursement._id
  );
  const disbursementMonthValues: number[] = monthlyDisbursement.map(
    (disbursement: Disbursement) => disbursement.totalDisbursement
  );

  const oustandingMonths: string[] = monthlyOutstandingBalance.map(
    (outstanding: Outstanding) => outstanding._id
  );
  const oustandingMonthValues: number[] = monthlyOutstandingBalance.map(
    (outstanding: Outstanding) => outstanding.outStandingBalance
  );

  const repaymentMonths: string[] = monthlyRepayment.map(
    (repayment: Repayment) => repayment._id
  );
  const repaymentMonthValues: number[] = monthlyRepayment.map(
    (repayment: Repayment) => repayment.monthlyRepayment
  );

  return {
    monthlyOutstandingBalance,
    monthlyDisbursement,
    totalUsers,
    totalClients,
    totalOutstandingBalance: totalOutstandingBalance[0]?.totalOutstanding || 0,
    totalArrears: totalArrears[0]?.totalOutstanding || 0,
    totalRepayment: totalRepayment[0]?.totalRepayment || 0,
    monthlyRepayment,
    totalDisbursement: totalDisbursement[0]?.totalDisbursement || 0,
    todayRepayment: todayRepayment[0]?.dailyRepayment || 0,
    todayDisbursement: todayDisbursement[0]?.todayDisbursement || 0,
    activities,
    disbursementMonths,
    disbursementMonthValues,
    oustandingMonths,
    oustandingMonthValues,
    repaymentMonths,
    repaymentMonthValues,
  };
}
