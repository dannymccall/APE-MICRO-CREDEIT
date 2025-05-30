import { NextRequest, NextResponse } from "next/server";
import { LoanApplication } from "@/app/lib/backend/models/loans.model";
import { Client } from "@/app/lib/backend/models/client.model";
import { PaymentSchedule } from "@/app/lib/backend/models/paymentSchdule.model";
import { User } from "@/app/lib/backend/models/user.model";
import { Activitymanagement } from "@/app/lib/backend/models/activitymanagement.model";
import { connectDB } from "@/app/lib/mongodb";

// Force Dynamic Rendering
// export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    // Date ranges for today
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Run multiple MongoDB queries in parallel
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
      activities,
    ] = await Promise.all([
      PaymentSchedule.aggregate([
           {
          $lookup: {
            from: "loanapplications", // collection name in MongoDB (should be lowercase and plural)
            localField: "loan",
            foreignField: "_id",
            as: "loanDetails",
          },
        },
        { $match: { "loanDetails.loanApprovalStatus": "Approved" } },
        
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
        { $match: { loanApprovalStatus: "Approved" } },
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
           {
          $lookup: {
            from: "loanapplications", // collection name in MongoDB (should be lowercase and plural)
            localField: "loan",
            foreignField: "_id",
            as: "loanDetails",
          },
        },
        { $match: { "loanDetails.loanApprovalStatus": "Approved" } },
        { $unwind: "$schedule" },
        {
          $group: {
            _id: null,
            totalOutstanding: { $sum: "$schedule.outStandingBalance" },
          },
        },
      ]),
      PaymentSchedule.aggregate([
        {
          $lookup: {
            from: "loanapplications", // collection name in MongoDB (should be lowercase and plural)
            localField: "loan",
            foreignField: "_id",
            as: "loanDetails",
          },
        },
        { $match: { "loanDetails.loanApprovalStatus": "Approved" } },
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
         {
          $lookup: {
            from: "loanapplications", // collection name in MongoDB (should be lowercase and plural)
            localField: "loan",
            foreignField: "_id",
            as: "loanDetails",
          },
        },
        { $match: { "loanDetails.loanApprovalStatus": "Approved" } },
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
        { $match: { loanApprovalStatus: "Approved" } },
        {
          $group: {
            _id: null,
            totalDisbursement: { $sum: "$principal" },
          },
        },
      ]),
      PaymentSchedule.aggregate([
         {
          $lookup: {
            from: "loanapplications", // collection name in MongoDB (should be lowercase and plural)
            localField: "loan",
            foreignField: "_id",
            as: "loanDetails",
          },
        },
        { $match: { "loanDetails.loanApprovalStatus": "Approved" } },
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
        {
          $match: {
            createdAt: {
              $gte: startOfDay,
              $lt: endOfDay,
              
            },
            loanApprovalStatus: "Approved"
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
            as: "userDetails",
          },
        },
        { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
        { $sort: { createdAt: -1 } },
        { $limit: 5 },
      ]),
    ]);
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

    return NextResponse.json(
      {
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
        activities,
        disbursementMonths,
        disbursementMonthValues,
        oustandingMonths,
        oustandingMonthValues,
        repaymentMonths,
        repaymentMonthValues,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error: any) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
