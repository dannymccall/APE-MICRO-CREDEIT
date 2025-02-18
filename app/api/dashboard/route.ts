import { NextRequest, NextResponse } from "next/server";
import {
  ILoanApplication,
  LoanApplication,
  LoanApplicationSchema,
} from "@/app/lib/backend/models/loans.model";
import { Client } from "@/app/lib/backend/models/client.model";
import {
  IPaymentSchedule,
  PaymentSchedule,
  PaymentScheduleSchema,
} from "@/app/lib/backend/models/paymentSchdule.model";
import { User } from "@/app/lib/backend/models/user.model";
import mongoose from "mongoose";
import { Activitymanagement } from "@/app/lib/backend/models/activitymanagement.model";
import { connectDB } from "@/app/lib/mongodb";
import { revalidatePath } from "next/cache";
export async function GET() {
  try {
    await connectDB();

    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
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
      activities
    ] = await Promise.all([
      PaymentSchedule.aggregate([
        { $unwind: "$schedule" },
        {
          $project: {
            yearMonth: {
              $dateToString: {
                format: "%Y-%m",
                date: "$createdAt",
              },
            },
            outStandingBalance: "$schedule.outStandingBalance",
          },
        },
        {
          $group: {
            _id: "$yearMonth",
            outStandingBalance: { $sum: "$outStandingBalance" },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      LoanApplication.aggregate([
        {
          $project: {
            yearMonth: {
              $dateToString: {
                format: "%Y-%m",
                date: "$createdAt",
              },
            },
            totalDisbursement: "$principal",
          },
        },
        {
          $group: {
            _id: "$yearMonth",
            totalDisbursement: { $sum: "$totalDisbursement" },
            count: { $sum: 1 },
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
        {
          $match: {
            "schedule.status": "arrears",
          },
        },
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
          $project: {
            yearMonth: {
              $dateToString: {
                format: "%Y-%m",
                date: "$createdAt",
              },
            },
            amountPaid: "$schedule.amountPaid",
          },
        },
        {
          $group: {
            _id: "$yearMonth",
            monthlyRepayment: { $sum: "$amountPaid" },
            count: { $sum: 1 },
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
        {
          $match: {
            createdAt: { $gte: startOfDay, $lt: endOfDay }, // Filter for today's date
          },
        },
        {
          $group: {
            _id: null,
            dailyRepayment: { $sum: "$schedule.amountPaid" }, // Changed to daily
          },
        },
        { $sort: { _id: 1 } },
      ]),
      LoanApplication.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfDay, $lt: endOfDay },
          },
        },
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
            as: "userDetails"
          }
        },

        {
          $unwind: {
            path: "$userDetails",
            preserveNullAndEmptyArrays: true // Keeps activities without users
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $limit: 5
        }
      ])

    ]);

    revalidatePath("activities");
    revalidatePath("loanapplications");
    revalidatePath("paymentschedules");

    return NextResponse.json({
      monthlyOutstandingBalance,
      monthlyDisbursement,
      totalUsers,
      totalClients,
      totalOutstandingBalance:
        totalOutstandingBalance[0]?.totalOutstanding || 0,
      totalArrears: totalArrears[0]?.totalOutstanding || 0,
      totalRepayment: totalRepayment[0]?.totalRepayment || 0,
      monthlyRepayment,
      totalDisbursement: totalDisbursement[0]?.totalDisbursement || 0,
      todayRepayment: todayRepayment[0]?.dailyRepayment || 0,
      todayDisbursement: todayDisbursement[0]?.todayDisbursement || 0,
      activities
    }, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=30", // Cache for 1 min
      }
    });
  } catch (error: any) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
