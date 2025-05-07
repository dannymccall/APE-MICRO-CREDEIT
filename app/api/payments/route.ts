import { NextRequest, NextResponse } from "next/server";
import {
  ILoanApplication,
  LoanApplication,
  LoanApplicationSchema,
} from "@/app/lib/backend/models/loans.model";
import { Client } from "@/app/lib/backend/models/client.model";
import { PaymentSchedule } from "@/app/lib/backend/models/paymentSchdule.model";
import mongoose from "mongoose";
import { connectDB } from "@/app/lib/mongodb";
import { createResponse } from "@/app/lib/helperFunctions";
import {
  ITemporalPayment,
  TemporalPayment,
} from "@/app/lib/backend/models/temporal.payment.model";
import { getUserId } from "../auth/route";
import { ActivitymanagementService } from "@/app/lib/backend/services/ActivitymanagementService";

await connectDB();
const activitymanagementService = new ActivitymanagementService();

export async function GET(req: NextRequest) {
  mongoose.set("bufferTimeoutMS", 15000);
  if (!mongoose.models.LoanApplication) {
    mongoose.model<ILoanApplication>("LoanApplication", LoanApplicationSchema);
  }
  try {
    const searchParams = req.nextUrl.searchParams;
    const paymentType = searchParams.get("paymentType");
    const clientId = searchParams.get("clientId");
    if (clientId && paymentType === "singlePayment") {
      const client: any = await Client.findOne({ systemId: clientId })
        .select("first_name last_name systemId")
        .populate({
          path: "loans",
          match: {
            paymentStatus: "not completed",
            nextPaymentStatus: "",
            loanApprovalStatus: "Approved",
          },

          select: ["nextPayment", "weeklyAmount", "systemId"],
        })
        .exec();

      if (!client.loans || client.loans.length === 0) {
        return createResponse(
          false,
          "400",
          "No active loans found for this client"
        );
      }
      return createResponse(true, "200", "", client);
    }

    if (paymentType === "bulkPayment") {
      // Get today's midnight UTC
      const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
    
      // Get the next day's midnight to form an exclusive range
      const endOfDay = new Date(new Date().setHours(24, 0, 0, 0));
    
      console.log("Start of Day:", startOfDay);
      console.log("End of Day:", endOfDay);
    
      // Query loans due today
      const loans: any = await LoanApplication.find({
        paymentStatus: "not completed",
        nextPaymentStatus: "",
        nextPayment: { $gte: startOfDay, $lt: endOfDay }, // ✅ Date range
        loanApprovalStatus: "Approved",
      })
        .select("nextPayment weeklyAmount systemId")
        .populate({
          path: "client",
          select: ["first_name", "last_name", "systemId"],
        })
        .exec();
    
      console.log({ loans });
      return NextResponse.json(loans);
    }
    
    
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData: any = await req.json();
    console.log({ formData });
    for (const [key, value] of Object.entries(formData)) {
      const typedValue = value as {
        amount: string;
        loanId: string;
        nextPayment: string;
        clientId: string;
      };

      if (
        !typedValue.amount ||
        !typedValue.clientId ||
        !typedValue.nextPayment ||
        !typedValue.loanId
      )
        continue;

      const loan = await LoanApplication.findOne({
        systemId: typedValue.loanId,
      });
      console.log({ loan });
      const client = await Client.findOne({ systemId: typedValue.clientId });

      const temporalPaymentBody: ITemporalPayment = {
        loan: loan?._id as mongoose.Types.ObjectId,
        paymentDate: new Date(typedValue.nextPayment),
        client: client?._id as mongoose.Types.ObjectId,
        weeklyAmountExpected: loan?.weeklyAmount as number,
        amountPaid: Number(typedValue.amount),
      };
      console.log(temporalPaymentBody);

      await Promise.all([
        TemporalPayment.create(temporalPaymentBody),
        LoanApplication.findOneAndUpdate(
          { systemId: typedValue.loanId },
          { nextPaymentStatus: "Pending" }
        ),
      ]);
    }
    const userId = await getUserId();
    await activitymanagementService.createActivity(
      "Loan Payment",
      new mongoose.Types.ObjectId(userId)
    );
    return createResponse(
      true,
      "200",
      "Loan Payment has been succefful, Please wait for confirmation",
      {}
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
