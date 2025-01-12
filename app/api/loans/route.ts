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
} from "@/app/lib/utils";
import { Client } from "@/app/lib/backend/models/client.model";
import { saveFile } from "../clients/route";
import { LoanApplication } from "@/app/lib/backend/models/loans.model";
await connectDB();
const clientService = new ClientService();
const loanService = new LoanService();
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
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const loanId = searchParams.get("loanId");
    const search = searchParams.get("search");

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
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store", // Prevent caching
          },
        }
      );
    }

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

    if (!pageParam && !limitParam) {
      const allLoans = await LoanApplication.find({});
      return NextResponse.json(
        { success: true, message: "Fetched all clients.", data: allLoans },
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

    const loans = await LoanApplication.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({path: "loanOfficer", select: ["first_name", "other_names", "last_name"]})

    const totalLoans = await LoanApplication.countDocuments();
    const totalPages = Math.ceil(totalLoans / limit);

    const pagination = {
      totalLoans,
      currentPage: page,
      totalPages,
    };

    return NextResponse.json(
      { success: true, message: "", data: loans, pagination },
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

    const bytes = await passport.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const originalName = passport.name;
    const fileExtension = originalName.substring(originalName.lastIndexOf("."));
    const newFileName = `${Date.now()}${fileExtension}`;
    console.log({ newFileName });
    await saveFile(newFileName, buffer);

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
    console.log(schedule);
    const nextPayment = calculateNextPayment(
      new Date(body.get("expectedDisbursementDate"))
    );

    console.log("interest", body.get("interest"));
    const lonaFieldMapping: Record<string, string> = {
      loanProduct: "loanProduct",
      principal: "principal",
      fund: "fund",
      loanTerms: "loanTerms",
      repaymentFrequency: "repaymentFrequency",
      type: "type",
      expectedDisbursementDate: "expectedDisbursementDate",
      loanPurpose: "loanPurpose",
      registrationFee: "registrationFee",
      advanceFee: "advanceFee",
      processingFee: "processingFee",
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
    const principal = Number(body.get("principal"));

    // Ensure principal is a valid number
    if (isNaN(principal) || principal <= 0) {
      throw new Error("Invalid principal amount");
    }
    
    // Monthly principal payment
    generatedLoanModelFields["principalPayment"] = (principal / 12).toFixed(2);
    
    // Monthly interest payment
    const interestRate = 0.0267; // 2.67%
    generatedLoanModelFields["interestPayment"] = (principal * interestRate).toFixed(2);
    
    console.log(generatedLoanModelFields);

    const newLoanApplication = await loanService.create(
      generatedLoanModelFields
    );
    console.log({ newLoanApplication });

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
    await loanService.update(newLoanApplication._id, {
      guarantor: newGuarantor._id,
      paymentSchedule: newPaymentSchedule._id,
    });

    await Client.updateOne(
      { _id: client._id }, // Match the document with this _id
      { $push: { loans: newLoanApplication._id } } // Push the new loan ID into the loans array
    );
    console.log(newGuarantor);
    return createResponse(
      true,
      "001",
      "Loan application added successfully",
      {}
    );
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
    const id: string | any = searchParams.get("id");

    const client = await clientService.findById(id);
    if (!client)
      return createResponse(false, "001", "Client does not exists", client);

    const deleteClient = await clientService.delete(id);
    if (!deleteClient)
      return createResponse(false, "001", "Something happened", {});

    return createResponse(
      true,
      "001",
      "Client deleted successfully",
      deleteClient
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}

// export async function PUT(req: NextRequest, res: NextResponse) {
//   const contentType = req.headers.get("content-type");
//   if (!contentType?.includes("multipart/form-data")) {
//     return NextResponse.json(
//       { error: "Unsupported Content-Type" },
//       { status: 400 }
//     );
//   }

//   try {
//     const body = await req.formData();
//     const searchParams = req.nextUrl.searchParams;
//     const id: string | any = searchParams.get("id");
//     if (!id) return createResponse(false, "001", "Client ID is required", {});

//     const client = await clientService.findById(id);
//     if (!client) return createResponse(false, "001", "Client not found", {});

//     const [staff, branch] = await Promise.all([
//       User.findOne({ username: body.get("staff") }),
//       Branch.findOne({ branchName: body.get("branch") }),
//     ]);

//     if (!staff) return createResponse(false, "001", "Staff does not exist", {});
//     if (!branch)
//       return createResponse(false, "001", "Branch does not exist", {});

//     // Utility function to check if a value is non-empty
//     const isNotEmpty = (value: unknown) =>
//       value !== undefined && value !== null && value !== "";

//     // Mapping between formData keys and client object keys
//     const fieldMapping: Record<string, string> = {
//       firstName: "first_name",
//       lastName: "last_name",
//       nickName: "nick_name",
//       title: "title",
//       mobile: "mobile",
//       residence: "residence",
//       maritalStatus: "maritalStatus",
//       gender: "gender",
//     };

//     // Dynamically construct updatedFields object
//     const updatedFields: Partial<typeof client> = {};

//     Object.entries(fieldMapping).forEach(([formKey, clientKey]) => {
//       const formValue = body.get(formKey);
//       if (isNotEmpty(formValue)) {
//         updatedFields[clientKey] = formValue;
//       }
//     });

//     // Handle special cases like file upload
//     const passport: File | null = body.get("passport") as unknown as File;
//     if (passport.name !== "") {
//       const bytes = await passport.arrayBuffer();
//       const buffer = Buffer.from(bytes);
//       const originalName = passport.name;
//       const fileExtension = originalName.substring(
//         originalName.lastIndexOf(".")
//       );
//       const newFileName = `${Date.now()}${fileExtension}`;
//       await saveFile(newFileName, buffer);
//       updatedFields["avarta"] = newFileName; // Update avatar if a new file is uploaded
//     }

//     updatedFields["staff"] = staff._id;
//     updatedFields["branch"] = branch._id;
//     updatedFields["client_status"] = body.get("clientStatus") as string;

//     const updatedClient = await clientService.update(id, updatedFields);

//     return createResponse(
//       true,
//       "001",
//       "Client updated successfully",
//       updatedClient
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { error: "An error occurred while processing the request." },
//       { status: 500 }
//     );
//   }
// }
