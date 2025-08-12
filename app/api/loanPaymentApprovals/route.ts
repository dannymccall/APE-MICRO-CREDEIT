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
import { Vault } from "@/app/lib/backend/models/vault.model";
const activitymanagementService = new ActivitymanagementService();

export async function POST(req: NextRequest) {
  try {
    const searchParameter = req.nextUrl.searchParams;
    const pendingLoanId = searchParameter.get("pendingLoanId");
    const loanId = searchParameter.get("loanId");
    const userId = await getUserId();

    // const userId = new mongoose.Types.ObjectId(getUserId())
    if (!pendingLoanId || !loanId) {
      return createResponse(false, "400", "Missing required parameters");
    }

    // Fetch required data
    const [pendingLoan, loanApplication, loanPaymentSchedule, vault] =
      (await Promise.all([
        TemporalPayment.findById(pendingLoanId),
        LoanApplication.findById(loanId)
          .populate({ path: "loanOfficer", select: "username", model: "User" })
          .exec(),
        PaymentSchedule.findOne({ loan: loanId }),
        Vault.find(),
      ])) as any[];

    if (!pendingLoan || !loanApplication || !loanPaymentSchedule) {
      return createResponse(false, "404", "Loan data not found");
    }

    const amountPaid = pendingLoan.amountPaid;
    // console.log(vault[0])
    if (amountPaid && !isNaN(amountPaid) && amountPaid > 0) {
      // console.log({amountPaid})

      if (!vault[0])
        return createResponse(
          false,
          "400",
          "Something went wrong, please try again"
        );
      vault[0].balance += parseFloat(amountPaid);
      vault[0].transactions.push({
        type: "Deposit",
        amount: parseFloat(amountPaid),
        createdAt: new Date(),
        staff: userId,
        purpose: "Loan Payment",
      });
      await vault[0].save();
    }
    const paymentSchedule = loanPaymentSchedule.schedule;
    let balance = amountPaid;

    // Helper function for date comparison
    const isSameDate = (date1: Date, date2: Date) =>
      new Date(date1).getTime() === new Date(date2).getTime();

    // Process payment schedule
    paymentSchedule.forEach((schedule: any) => {
      if (schedule.status === "arrears" || schedule.status === "default" && balance > 0) {
        const outstanding = Number(schedule.outStandingBalance);

        if (balance >= outstanding) {
          balance -= outstanding;
          schedule.amountPaid += outstanding;
          schedule.outStandingBalance = 0;
          schedule.status = "paid";
          schedule.datePaid = new Date(pendingLoan.createdAt);
        } else {
          schedule.outStandingBalance = outstanding - balance;
          schedule.status =schedule.status;
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
            schedule.datePaid = new Date(pendingLoan.createdAt);
          } else {
            schedule.outStandingBalance = schedule.amountToPay - balance;
            schedule.status = schedule.status;
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
    ]);
    await makeRequest(
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/sockets/notify-loan-officer`,
      {
        method: "POST",
        body: JSON.stringify({
          loanOfficer: loanApplication.loanOfficer.username,
          message: "Your payment has been approved",
        }),
        headers: { "Content-Type": "application/json" },
      }
    );
    // console.log(response);
    await activitymanagementService.createActivity(
      "Loan Payment Approval",
      new mongoose.Types.ObjectId(userId)
    );
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
