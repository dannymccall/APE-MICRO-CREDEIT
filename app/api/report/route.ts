import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { LoanApplication } from "@/app/lib/backend/models/loans.model";
import { PaymentSchedule } from "@/app/lib/backend/models/paymentSchdule.model";
import mongoose from "mongoose";
import {
  IGuatantor,
  GuarantorSchema,
} from "@/app/lib/backend/models/guarantor.models";
import {
  LoanApplicationSchema,
  ILoanApplication,
} from "@/app/lib/backend/models/loans.model";
import { IClient, ClientSchema } from "@/app/lib/backend/models/client.model";
import { IUser, UserSchema } from "@/app/lib/backend/models/user.model";
import { getOutstandingBalances } from "@/app/lib/helperFunctions";
import { getUserId } from "../auth/route";
import { ActivitymanagementService } from "@/app/lib/backend/services/ActivitymanagementService";

interface Client {
  first_name: string;
  last_name: string;
  mobile: string;
  union: string;
  unionLocation: string;
}

interface Guarantor {
  guarantorFullName: string;
  mobile: string;
}

interface PaymentScheduleItem {
  outStandingBalance: number;
  interestPayment: number;
  amountToPay: number;
  amountPaid: number;
}

interface LoanApplication {
  _id: string;
  maturityDate: string;
  expectedDisbursementDate: string;
  client: Client | string;
  guarantor: Guarantor | null;
  paymentSchedule: {
    schedule: PaymentScheduleItem[];
  };
}

const getPaymentScheduleData = async (
  type: string,
  startDate?: string,
  endDate?: string,
  staff?: string
) => {
  const status =
    type === "repayments"
      ? "not paid"
      : type === "arrears"
      ? "arrears"
      : type === "default"
      ? "default"
      : type === "outstanding"
      ? { $in: ["not paid", "paid", "arrears"] }
      : type === "payments"
      ? "paid"
      : null;

  if (!status) {
    throw new Error("Invalid type specified");
  }

  const matchFilter: any = {
    "schedule.status": status,
  };

  // console.log({matchFilter})
  const staffMatch: any = {};
  // console.log({ matchFilter });
  if (startDate && endDate) {
    // console.log("there is start and end")
    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(23, 59, 59, 999);

    matchFilter["schedule.nextPayment"] = {
      $gte: new Date(start),
      $lte: new Date(end),
    };

    // console.log({matchFilter})
  } else if (startDate) {
    const start = new Date(startDate).setHours(0, 0, 0, 0); // Ensure full day inclusion
    matchFilter["schedule.nextPayment"] = {
      $gte: new Date(start),
    };
  } else if (endDate) {
    const end = new Date(endDate).setHours(23, 59, 59, 999);
    matchFilter["schedule.nextPayment"] = {
      $lte: new Date(end),
    };
    // console.log({ staff });
  } else if (staff) {
    // console.log(staff);
    staffMatch["staff"] = new mongoose.Types.ObjectId(staff);
  }

  const pipeline = [];

  // ✅ Add the $match filter for staff ONLY if it's provided
  if (staff) {
    pipeline.push({ $match: { staff: new mongoose.Types.ObjectId(staff) } });
  }

  // ✅ Unwind schedules

  // ✅ Apply the general match filters
  // pipeline.push({ $match: matchFilter });

  // ✅ Lookup for loan details
  pipeline.push(
    {
      $lookup: {
        from: "loanapplications",
        localField: "loan",
        foreignField: "_id",
        as: "loanDetails",
      },
    },

    {
      $match: {
        "loanDetails.loanApprovalStatus": "Approved",
      },
    },
    {
      $lookup: {
        from: "clients",
        localField: "client",
        foreignField: "_id",
        as: "clientDetails",
      },
    },
    {
      $lookup: {
        from: "guarantors",
        localField: "loanDetails.guarantor",
        foreignField: "_id",
        as: "guarantorDetails",
      },
    }
  );
  pipeline.push({ $unwind: "$schedule" });

  pipeline.push({ $match: matchFilter });

  // ✅ Group the data
  pipeline.push({
    $group: {
      _id: null,
      paymentSchedule: {
        $push: {
          schedules: {
            nextPayment: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$schedule.nextPayment",
              },
            },
            amountToPay: "$schedule.amountToPay",
            status: "$schedule.status",
            amountPaid: "$schedule.amountPaid",
            week: "$schedule.week",
            principalPayment: "$schedule.principalPayment",
            interestPayment: "$schedule.interestPayment",
            outStandingBalance: "$schedule.outStandingBalance",
          },
          loanDetails: { $first: "$loanDetails" },
          clientDetails: { $first: "$clientDetails" },
          guarantorDetails: { $first: "$guarantorDetails" },
        },
      },
      grantTotalOfPaid: { $sum: "$schedule.amountPaid" },
      grandTotalOutStanding: { $sum: "$schedule.outStandingBalance" },
      totalPricipalPayment: { $sum: "$loanDetails.principalPayment" },
      totalInterestPayment: { $sum: "$loanDetails.interestPayment" },
      totalAmountToPay: { $sum: "$schedule.amountToPay" },
      totalAmountPaid: { $sum: "$schedule.amountPaid" },
      totalOutStandingBalance: { $sum: "$schedule.outStandingBalance" },
    },
  });

  return await PaymentSchedule.aggregate(pipeline);
};
const activitymanagementService = new ActivitymanagementService();

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    if (!mongoose.models.Guarantor) {
      mongoose.model<IGuatantor>("Guarantor", GuarantorSchema);
    }

    if (!mongoose.models.Client) {
      mongoose.model<IClient>("Client", ClientSchema);
    }
    if (!mongoose.models.User) {
      mongoose.model<IUser>("User", UserSchema);
    }

    const results: Record<string, any[]> = {};
    const body = await req.json();
    // console.log({ body });
    const { startDate, endDate, filters, staff } = body;
    // console.log({ staff });
    const filterArray = filters.split(",");
    let data: any[] = [];

    if (
      (startDate === "" && endDate === "" && filters.length === 0) ||
      (startDate && endDate && filters.length === 0) ||
      (startDate && !endDate && filters.length === 0) ||
      (!startDate && endDate && filters.length === 0)
    ) {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

      // Construct query object
      const query: any = {};
      // console.log("Start:", start);
      // console.log("End:", end);
      if (start) query.createdAt = { $gte: start };
      if (end)
        query.createdAt = { ...(query.createdAt || {}), $lte: new Date(end) };
      if (staff) {
        // console.log("Staff:", staff);
        query["loanOfficer"] = new mongoose.Types.ObjectId(staff);
      }
      // console.log("Query:", query);

      query["loanApprovalStatus"] = "Approved";
      // console.log({query})
      data = await LoanApplication.find(query)
        .populate("client")
        .populate("loanOfficer")
        .populate("guarantor")
        .populate("paymentSchedule");

      results["report"] = data;

      // console.log(data);
      return NextResponse.json(results);
    }

    for (const filter of filterArray) {
      const matchStage: any = {};

      if (startDate || endDate) {
        matchStage["createdAt"] = {};
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        if (startDate) matchStage["createdAt"].$gte = start;
        if (endDate) matchStage["createdAt"].$lte = end;
      }
      if (staff) {
        // console.log("Staff:", staff);
        matchStage["loanOfficer"] = new mongoose.Types.ObjectId(staff);
      }

      console.log(matchStage);

      matchStage["loanApprovalStatus"] = "Approved";
      // console.log({matchStage})
      switch (filter) {
        case "disbursement":
          data = await LoanApplication.find(matchStage)
            .populate("client")
            .populate("guarantor")
            .populate("loanOfficer")
            .populate("paymentSchedule");
          break;
        case "matured_loans":
          matchStage["paymentStatus"] = "completed";
          data = await LoanApplication.find(matchStage)
            .populate("client")
            .populate("guarantor")
            .populate("loanOfficer")
            .populate("paymentSchedule");
          break;
        case "repayments":
        case "arrears":
        case "default":
        case "payments":
          data = await getPaymentScheduleData(
            filter,
            startDate,
            endDate,
            staff
          );
          break;
        case "outstanding":
          const loans = await LoanApplication.find(matchStage)
            .populate({
              path: "client",
              model: "Client",
              select: [
                "first_name",
                "last_name",
                "mobile",
                "union",
                "unionLocation",
              ],
            })
            .populate({
              path: "guarantor",
              model: "Guarantor",
              select: ["guarantorFullName", "mobile"],
            })
            .populate({
              path: "paymentSchedule",
              populate: { path: "schedule" },
            });
          data = getOutstandingBalances(loans);
          break;
        default:
          data = [];
          break;
      }
      console.log({ data });
      if (data.length) {
        results[filter ? filter : "allReport"] = data;
      }
    }
    const userId = await getUserId();
    await activitymanagementService.createActivity(
      "Report Generation",
      new mongoose.Types.ObjectId(userId)
    );
    return NextResponse.json(results);
  } catch (error) {
    // console.error("Error handling POST request:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
