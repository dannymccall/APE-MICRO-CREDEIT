import { NextRequest, NextResponse } from "next/server";
import { LoanApplication, ILoanApplication } from "@/app/lib/backend/models/loans.model";
import { connectDB } from "@/app/lib/mongodb";
import { PaymentScheduleSchema,PaymentSchedule, IPaymentSchedule } from "@/app/lib/backend/models/paymentSchdule.model";
import mongoose from "mongoose";

interface Schedule {
  week: number;
  amountToPay: number;
  nextPayment: string;
  amountPaid?: number;
  outStandingBalance?: number;
  status?: string;
}

interface ILoan extends Omit<ILoanApplication, "paymentStatus" | "paymentSchedule"> {
  paymentStatus: string;
  _id:string;
  paymentSchedule: {
    _id:string;
    schedule: Schedule[]
  };
}


export async function GET(request: NextRequest) {
  await connectDB();

  if (!mongoose.models.PaymentSchedule) {
      mongoose.model<IPaymentSchedule>(
        "LoanApplication",
        PaymentScheduleSchema
      );
    }
  try {
    console.log("Cron ran at ", new Date());

    const loans = await LoanApplication.find({ paymentStatus: "not completed" }).populate({
      path: "paymentSchedule",
      populate: { path: "schedule" },
      select: "schedule",
    }) as unknown as ILoan[];

    const today = new Date();
  
    await Promise.all(
      loans.map(async (loan) => {
        if (!loan.paymentSchedule) return;

        let isUpdated = false;
        const maturityDate = new Date(loan.maturityDate); // Ensure maturityDate is in your model

        loan.paymentSchedule.schedule.forEach((schedule: Schedule) => {
          const nextPaymentDate = new Date(schedule.nextPayment);

          if (nextPaymentDate < today && schedule.status !== "paid") {
            schedule.status = "arrears";
            isUpdated = true;
          }

          if (nextPaymentDate < today && today > maturityDate && schedule.status !== "paid") {
            schedule.status = "default";
            loan.paymentStatus = "default";
            isUpdated = true;
          }
        });

        if (loan.paymentSchedule.schedule.every((schedule: Schedule) => schedule.status === "paid")) {
          loan.paymentStatus = "completed";
          isUpdated = true;
        }

        if (isUpdated) {
          loan.markModified("paymentSchedule"); // Ensures changes are tracked
          await loan.save();
        }
      })
    );

    return NextResponse.json({ loans, message: "Cron job executed successfully" });
  } catch (error) {
    console.error("Error running cron job:", error);
    return NextResponse.json({ error: "An error occurred while processing the request." }, { status: 500 });
  }
}
