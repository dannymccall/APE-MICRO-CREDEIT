import { NextRequest, NextResponse } from "next/server";
import {
  LoanApplication,
  ILoanApplication,
} from "@/app/lib/backend/models/loans.model";
import { connectDB } from "@/app/lib/mongodb";
import {
  PaymentScheduleSchema,
  IPaymentSchedule,
} from "@/app/lib/backend/models/paymentSchdule.model";
import mongoose from "mongoose";

interface Schedule {
  week: number;
  amountToPay: number;
  nextPayment: string;
  amountPaid?: number;
  outStandingBalance?: number;
  status?: string;
}

interface ILoan
  extends Omit<ILoanApplication, "paymentStatus" | "paymentSchedule"> {
  paymentStatus: string;
  _id: string;
  paymentSchedule: {
    _id: string;
    schedule: Schedule[];
  };
}

export async function GET() {
  await connectDB();

  // ✅ Register the model correctly
  if (!mongoose.models.PaymentSchedule) {
    mongoose.model<IPaymentSchedule>("PaymentSchedule", PaymentScheduleSchema);
  }

  try {
    console.log("Cron ran at ", new Date());

    const loans: ILoan[] = (await LoanApplication.find({
      paymentStatus: { $ne: "completed" }, // only incomplete loans
    }).populate({
      path: "paymentSchedule",
      select: "schedule",
    })) as unknown as ILoan[];

    const today = new Date();
    const startOfDayUTC = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
    );

    console.log("Processing date:", startOfDayUTC.toISOString());

    await Promise.all(
      loans.map(async (loan: any) => {
        if (!loan.paymentSchedule) return;

        let isUpdated = false;
        const maturityDate = new Date(loan.maturityDate);

        // 🔹 Step 1: update schedule items
        loan.paymentSchedule.schedule.forEach((schedule: Schedule) => {
          const nextPaymentDate = new Date(schedule.nextPayment);

          if (schedule.status !== "paid") {
            if (nextPaymentDate < startOfDayUTC) {
              schedule.status = "arrears";
              isUpdated = true;
            }

            if (startOfDayUTC > maturityDate) {
              schedule.status = "default";
              isUpdated = true;
            }
          }
        });

        // 🔹 Step 2: recalc loan status directly from schedule
        if (loan.paymentSchedule.schedule.every((s: Schedule) => s.status === "paid")) {
          loan.paymentStatus = "completed";
        } else if (loan.paymentSchedule.schedule.some((s: Schedule) => s.status === "default")) {
          loan.paymentStatus = "default";
        } else {
          loan.paymentStatus = "not completed";
        }

        isUpdated = true; // always sync status

        // 🔹 Step 3: save properly
        if (isUpdated) {
          loan.markModified("paymentSchedule");
          await loan.save();
          await loan.paymentSchedule.save()
        }
      })
    );

    return NextResponse.json({
      message: "Cron job executed successfully",
    });
  } catch (error) {
    console.error("Error running cron job:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
