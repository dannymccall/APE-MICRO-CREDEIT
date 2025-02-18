import { NextResponse, type NextRequest } from "next/server";
import { ClientService } from "@/app/lib/backend/services/clientService";
import { connectDB } from "@/app/lib/mongodb";
import { User } from "@/app/lib/backend/models/user.model";
import { LoanService } from "@/app/lib/backend/services/loanService";
import { Guarantor } from "@/app/lib/backend/models/guarantor.models";
import { PaymentSchedule } from "@/app/lib/backend/models/paymentSchdule.model";
import {
  validateNumber,
  createResponse,
  generateSystemID,
  calculateLoanInformaion,
  generatePaymentSchedule,
  calculateNextPayment,
  makeRequest,
} from "@/app/lib/helperFunctions";
import { Client } from "@/app/lib/backend/models/client.model";
import { saveFile } from "../clients/route";
import { LoanApplication } from "@/app/lib/backend/models/loans.model";
import { getUserId } from "../auth/route";
import mongoose from "mongoose";
import { ActivitymanagementService } from "@/app/lib/backend/services/ActivitymanagementService";

await connectDB();
const clientService = new ClientService();
const loanService = new LoanService();
const activitymanagementService = new ActivitymanagementService();
const isNotEmpty = (value: unknown) =>
  value !== undefined && value !== null && value !== "";

const generateModelFields = (
  fieldMapping: Record<string, string>,
  loanFields: Record<string, string | any>,
  body: any
) => {
  Object.entries(fieldMapping).forEach(([formKey, clientKey]) => {
    const formValue = body.get(formKey);
    if (isNotEmpty(formValue)) {
      loanFields[clientKey] = formValue;
    }
  });
  return loanFields;
};

export async function generateFileName(passport: File | null) {
  const bytes = await passport?.arrayBuffer();
  if (!bytes) {
    throw new Error("Failed to read file bytes");
  }
  const buffer = Buffer.from(bytes);
  const originalName = passport?.name;
  const fileExtension = originalName?.substring(originalName.lastIndexOf("."));
  console.log(fileExtension);
  const newFileName = `${Date.now()}${fileExtension}`;
  return { newFileName, buffer };
}
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const loanId = searchParams.get("loanId");
    const search = searchParams.get("search");
    const query = searchParams.get("query");

    // Handle loan search by query
    if (query) {
      try {
        const loans = await LoanApplication.find({})
          .populate({
            path: "client",
            match: {
              $or: [
                { first_name: { $regex: query, $options: "i" } },
                { last_name: { $regex: query, $options: "i" } },
              ],
            },
            select: "first_name last_name"
          })
          .populate({
            path: "loanOfficer",
            select: "first_name other_names last_name"
          })
          .lean();

        const matchedLoans = loans.filter(loan => loan.client !== null);

        if (matchedLoans.length === 0) {
          return NextResponse.json(
            {
              success: false,
              message: "No loans found matching the search criteria",
              data: []
            },
            { status: 404, headers: { "Cache-Control": "no-store" } }
          );
        }

        return NextResponse.json(
          { success: true, data: matchedLoans },
          { status: 200, headers: { "Cache-Control": "no-store" } }
        );
      } catch (error) {
        console.error("Error searching loans:", error);
        return createResponse(false, "500", "Error searching loans", {});
      }
    }

    // Handle loan lookup by ID
    if (loanId) {
      const loan = await LoanApplication.findOne({ systemId: loanId })
        .populate({
          path: "loanOfficer",
          select: ["first_name", "other_names", "last_name", "roles"],
        })
        .populate({ path: "guarantor" })
        .populate({ path: "client" })
        .populate({ path: "paymentSchedule" });

      return NextResponse.json(
        { success: true, message: "Generated", data: loan },
        { status: 200, headers: { "Cache-Control": "no-store" } }
      );
    }

    // Handle search by first/last name
    if (search) {
      const loans = await LoanApplication.find({
        $and: [
          {
            $or: [
              { first_name: { $regex: search, $options: "i" } },
              { last_name: { $regex: search, $options: "i" } },
            ],
          },
          { client_status: "active" },
        ],
      });

      return createResponse(true, "200", "", loans);
    }

    // Handle paginated results
    const page = parseInt(pageParam || "1", 10);
    const limit = parseInt(limitParam || "10", 10);

    // If no pagination params, return all loans
    if (!pageParam && !limitParam) {
      const allLoans = await LoanApplication.find({});
      return NextResponse.json(
        { success: true, message: "Fetched all loans", data: allLoans },
        { status: 200, headers: { "Cache-Control": "no-store" } }
      );
    }

    // Get paginated loans with populated fields
    const [loans, totalLoans] = await Promise.all([
      LoanApplication.find({})
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
          path: "loanOfficer",
          select: ["first_name", "other_names", "last_name"],
        })
        .populate({ path: "client", select: ["first_name", "last_name"] }),
      LoanApplication.countDocuments()
    ]);

    return NextResponse.json(
      {
        success: true,
        data: loans,
        pagination: {
          totalLoans,
          currentPage: page,
          totalPages: Math.ceil(totalLoans / limit),
        }
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      }
    );

  } catch (error: any) {
    console.error("Error in GET /api/loans:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  const contentType = req.headers.get("content-type");
  if (!contentType?.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Unsupported Content-Type" },
      { status: 400 }
    );
  }
  try {
    const body: FormData | any = await req.formData();
    const isNumberValid = validateNumber(body.get("guarantorMobile") as string);

    if (!isNumberValid)
      return createResponse(false, "001", "Mobile number is invalid", {});

    const [staff, client] = await Promise.all([
      User.findOne({ username: body.get("loanOfficer") }),
      Client.findOne({ systemId: body.get("client") }),
    ]);

    if (!staff)
      return createResponse(false, "001", "Loan Officer does not exist", {});
    if (!client)
      return createResponse(false, "001", "Client does not exist", {});
    const passport: File | null = body.get("file") as unknown as File;
    let newFileName: string = "";

    if (passport.name) {
      let result: { newFileName: string; buffer: any } = await generateFileName(
        passport
      );
      newFileName = result.newFileName;
      await saveFile(newFileName, result.buffer);
    }

    const guarantorSystemId: string = generateSystemID("GUA");
    const loanSystemId: string = generateSystemID("LOA");
    const weeklyPayment = calculateLoanInformaion(
      Number(body.get("principal")),
      3,
      Number(body.get("interest"))
    );

    const schedule = generatePaymentSchedule(
      Number(body.get("principal")),
      new Date(body.get("expectedDisbursementDate")),
      Number(weeklyPayment)
    );
    const nextPayment = calculateNextPayment(
      new Date(body.get("expectedDisbursementDate"))
    );

    const lonaFieldMapping: Record<string, string> = {
      loanProduct: "loanProduct",
      principal: "principal",
      fund: "fund",
      loanTerms: "loanTerms",
      repaymentFrequency: "repaymentFrequency",
      type: "type",
      expectedDisbursementDate: "expectedDisbursementDate",
      loanPurpose: "loanPurpose",
      // registrationFee: "registrationFee",
      // advanceFee: "advanceFee",
      // processingFee: "processingFee",
    };

    // Dynamically construct updatedFields object
    let fields: Partial<typeof client> = {};
    const generatedLoanModelFields = generateModelFields(
      lonaFieldMapping,
      fields,
      body
    );
    generatedLoanModelFields["monthlyInterest"] = body.get("interest");
    generatedLoanModelFields["nextPayment"] = nextPayment;
    generatedLoanModelFields["loanOfficer"] = staff._id;
    generatedLoanModelFields["weeklyAmount"] = Number(weeklyPayment);
    generatedLoanModelFields["systemId"] = loanSystemId;
    generatedLoanModelFields["client"] = client._id;
    generatedLoanModelFields["maturityDate"] = new Date(
      schedule[schedule.length - 1].nextPayment
    );
    const principal = Number(body.get("principal"));

    // Ensure principal is a valid number
    if (isNaN(principal) || principal <= 0) {
      throw new Error("Invalid principal amount");
    }

    // Monthly principal payment
    generatedLoanModelFields["principalPayment"] = (principal / 12).toFixed(2);

    // Monthly interest payment
    const interestRate = 0.0267; // 2.67%
    generatedLoanModelFields["interestPayment"] = (
      principal * interestRate
    ).toFixed(2);

    const newLoanApplication = await loanService.create(
      generatedLoanModelFields
    );

    fields = {};

    const guarantorfieldMapping: Record<string, string | any> = {
      guarantorFullName: "guarantorFullName",
      guarantorOccupation: "guarantorOccupation",
      guarantorUnionName: "guarantorUnionName",
      guarantorResidence: "guarantorResidence",
    };

    const generatedGuarantorModelFields = generateModelFields(
      guarantorfieldMapping,
      fields,
      body
    );
    console.log({ newFileName });
    generatedGuarantorModelFields["systemId"] = guarantorSystemId;
    generatedGuarantorModelFields["avarta"] = newFileName;
    generatedGuarantorModelFields["loan"] = newLoanApplication._id;
    generatedGuarantorModelFields["mobile"] = body.get("guarantorMobile");
    generatedGuarantorModelFields["client"] = client._id;

    const newGuarantor = await Guarantor.create(generatedGuarantorModelFields);
    const paymentSchedule = {
      loan: newLoanApplication._id,
      client: client._id,
      schedule: schedule,
    };
    const newPaymentSchedule = await PaymentSchedule.create(paymentSchedule);
    await Promise.all([
      loanService.update(newLoanApplication._id, {
        guarantor: newGuarantor._id,
        paymentSchedule: newPaymentSchedule._id,
      }),
      Client.updateOne(
        { _id: client._id }, // Match the document with this _id
        { $push: { loans: newLoanApplication._id } } // Push the new loan ID into the loans array
      ),
    ]);

    const userId = await getUserId();
    await activitymanagementService.createActivity(
      "New Loan Application",
      new mongoose.Types.ObjectId(userId)
    );
    return createResponse(true, "001", "Loan application successfully", {});
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const loanId: string | any = searchParams.get("_id");

    const loan = await loanService.findById(loanId);
    if (!loan) return createResponse(false, "001", "Loan does not exist");

    const deletedLoan = await loanService.delete(loanId);
    if (!deletedLoan)
      return createResponse(false, "001", "Something happened", {});

    await Promise.all([
      PaymentSchedule.findByIdAndDelete(loan.paymentSchedule),
      Guarantor.findByIdAndDelete(loan.guarantor),
    ]);
    const userId = await getUserId();
    await activitymanagementService.createActivity(
      "Loan Deletion",
      new mongoose.Types.ObjectId(userId)
    );
    return createResponse(
      true,
      "001",
      "Loan deleted successfully",
      deletedLoan
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const approveLoan = searchParams.get("approveLoan");
    const loanId = searchParams.get("_id") as string;
    if (approveLoan) {
      const loan = await LoanApplication.findById(loanId).populate({
        path: "loanOfficer",
        select: ["username"],
      });

      if (!loan) return createResponse(false, "400", "Loan ID is Invalid");

      await Promise.all([
        loanService.update(loanId, {
          loanApprovalStatus: "Approved",
        }),
        makeRequest(
          `${process.env.NEXT_PUBLIC_SOCKET_URL}/notify-loan-officer`,
          {
            method: "POST",
            body: JSON.stringify({
              loanOfficer: loan.loanOfficer.username,
              message: "Your loan application has approved",
            }),
            headers: { "Content-Type": "application/json" },
          }
        ),
      ]);
      const userId = await getUserId();
      await activitymanagementService.createActivity(
        "Loan Application Approval",
        new mongoose.Types.ObjectId(userId)
      );
      return createResponse(true, "200", "Loan Approval Successful");
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
