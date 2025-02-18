import { TemporalPayment } from "@/app/lib/backend/models/temporal.payment.model";
import { connectDB } from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { LoanApplication } from "@/app/lib/backend/models/loans.model";
import { Client } from "@/app/lib/backend/models/client.model";
import { PaymentSchedule } from "@/app/lib/backend/models/paymentSchdule.model";
import { createResponse, makeRequest } from "@/app/lib/helperFunctions";
import { ActivitymanagementService } from "@/app/lib/backend/services/ActivitymanagementService";
import { getUserId } from "../auth/route";
import mongoose from "mongoose";


const activitymanagementService = new ActivitymanagementService()

export async function POST(req: NextRequest) {
  try {
    const searchParameter = req.nextUrl.searchParams;
    const pendingLoanId = searchParameter.get("pendingLoanId");
    const loanId = searchParameter.get("loanId");

    if (!pendingLoanId || !loanId) {
      return createResponse(false, "400", "Missing required parameters");
    }

    // Fetch required data
    const [pendingLoan, loanApplication, loanPaymentSchedule] =
      await Promise.all([
        TemporalPayment.findById(pendingLoanId),
        LoanApplication.findById(loanId).populate({ path: "loanOfficer", select: "username", model: "User" }),
        PaymentSchedule.findOne({ loan: loanId }),
      ]);

    if (!pendingLoan || !loanApplication || !loanPaymentSchedule) {
      return createResponse(false, "404", "Loan data not found");
    }

    const amountPaid = pendingLoan.amountPaid;
    const paymentSchedule = loanPaymentSchedule.schedule;
    let balance = amountPaid;

    // Helper function for date comparison
    const isSameDate = (date1: Date, date2: Date) =>
      new Date(date1).getTime() === new Date(date2).getTime();

    // Process payment schedule
    paymentSchedule.forEach((schedule) => {
      if (schedule.status === "arrears" && balance > 0) {
        const outstanding = Number(schedule.outStandingBalance);
        if (balance >= outstanding) {
          balance -= outstanding;
          schedule.amountPaid += outstanding;
          schedule.outStandingBalance = 0;
          schedule.status = "paid";
        } else {
          schedule.outStandingBalance = outstanding - balance;
          schedule.status = "arrears";
          balance = 0;
        }
      }

      if (balance > 0) {
        const paymentDate = new Date(pendingLoan.paymentDate as Date);
        if (
          isSameDate(schedule.nextPayment, paymentDate) &&
          schedule.status === "not paid"
        ) {
          if (balance >= schedule.amountToPay) {
            schedule.amountPaid = schedule.amountToPay;
            schedule.outStandingBalance = 0;
            schedule.status = "paid";
            balance -= schedule.amountToPay;
          } else {
            schedule.outStandingBalance = schedule.amountToPay - balance;
            schedule.status = "arrears";
            schedule.amountPaid = Number(balance);
            balance = 0;
          }
        }
      }
    });

    // Update database records
    await Promise.all([
      PaymentSchedule.updateOne(
      { _id: loanPaymentSchedule._id },
      { schedule: paymentSchedule }
      ),
      LoanApplication.updateOne(
      { _id: loanId },
      {
        nextPayment: new Date(loanApplication.nextPayment as Date).setDate(
        new Date(loanApplication.nextPayment as Date).getDate() + 7
        ),
        nextPaymentStatus: "",
      }
      ),
      TemporalPayment.findByIdAndDelete(pendingLoanId),
      makeRequest(`${process.env.NEXT_PUBLIC_SOCKET_URL}/notify-loan-officer`, 
        {
        method: "POST", 
        body: JSON.stringify({ loanOfficer: loanApplication.loanOfficer.username, message: "Your payment has been approved" }), 
        headers: { "Content-Type": "application/json" }
        })
    ]);
     const userId = await getUserId();
      await activitymanagementService.createActivity("Loan Payment Approval", new mongoose.Types.ObjectId(userId));
    return createResponse(true, "200", "Pending Loan Payment approved");
  } catch (error) {
    console.error("Error processing loan:", error);
    return createResponse(
      false,
      "500",
      "An error occurred while processing the loan"
    );
  }
}
