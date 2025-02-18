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

await connectDB();
export async function GET(req: NextRequest) {
  try {
    if (!mongoose.models.LoanApplication) {
      mongoose.model<ILoanApplication>(
        "LoanApplication",
        LoanApplicationSchema
      );
    }

    const searchParams = req.nextUrl.searchParams;

    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const clientId = searchParams.get("clientId");
    const search = searchParams.get("search");

    console.log(clientId);
    if (clientId) {
      console.log(mongoose.modelNames()); // Should include "LoanApplication", "Client", etc.

      const client = await Client.findOne({ systemId: clientId })
        .populate({
          path: "staff",
          select: [
            "first_name",
            "last_name",
            "other_names",
            "username",
            "roles",
          ],
        })
        .populate({ path: "branch", select: ["branchName"] })
        .populate("loans");
      // .exec();

      console.log(client);
      return NextResponse.json(
        { success: true, message: "Generated", data: client },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store", // Prevent caching
          },
        }
      );
    }

    if (search) {
      const clients = await Client.find({
        $and: [
          {
            $or: [
              { first_name: { $regex: search, $options: "i" } },
              { last_name: { $regex: search, $options: "i" } },
            ],
          },
          { client_status: "active" },
        ],
      }).populate("loans");

      return createResponse(true, "200", "", clients);
    }

    if (!pageParam && !limitParam) {
      const allPendingPaymentApprovals = await TemporalPayment.find({})
        .populate({
          path: "loan",
          select: ["systemId", "weeklyAmount", "nextPayment"],
        })
        .populate({
          path: "client",
          select: ["first_name", "last_name", "systemId"],
        });
      return NextResponse.json(
        { success: true, message: "Fetched all clients.", data: allPendingPaymentApprovals },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store", // Prevent caching
          },
        }
      );
    }

    const page = parseInt(pageParam || "1", 10);
    const limit = parseInt(limitParam || "10", 10);

    const pendingLoanRepayments = await TemporalPayment.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "loan",
        select: ["systemId", "weeklyAmount", "nextPayment"],
      })
      .populate({
        path: "client",
        select: ["first_name", "last_name", "systemId"],
      });

    const totalUsers = await TemporalPayment.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    const pagination = {
      totalUsers,
      currentPage: page,
      totalPages,
    };

    return NextResponse.json(
      { success: true, message: "", data: pendingLoanRepayments, pagination },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store", // Prevent caching
        },
      }
    );
  } catch (e: any) {
    console.log(e.message);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const formData: any = await req.json();
    let formDataLength = 0;
    console.log(Array.isArray(formData));
    if (Array.isArray(formData)) {
      formData.forEach(async (item) => {
        formDataLength += 1;
        // Process the item
      });
    }
    for (const [key, value] of Object.entries(formData)) {
      const typedValue = value as {
        amount: string;
        loanId: string;
        nextPayment: string;
        clientId: string;
      };
      const formDataLength = Object.keys(formData).length;
      console.log("Form Data Length:", formDataLength);
      const loan = await LoanApplication.findOne({
        systemId: typedValue.loanId,
      });
      const client = await Client.findOne({ systemId: typedValue.clientId });

      const temporalPaymentBody: ITemporalPayment = {
        loan: loan?._id as any,
        paymentDate: new Date(typedValue.nextPayment),
        client: client?._id as any,
        weeklyAmountExpected: loan?.weeklyAmount as any,
        amountPaid: Number(typedValue.amount),
      };
      const newTemporalPayment = await TemporalPayment.create(
        temporalPaymentBody
      );

      await LoanApplication.findOneAndUpdate(
        { systemId: typedValue.loanId },
        { nextPaymentStatus: "Pending" }
      );
    }

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
