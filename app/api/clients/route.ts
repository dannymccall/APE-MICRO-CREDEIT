import { NextResponse, type NextRequest } from "next/server";
import { ClientService } from "@/app/lib/backend/services/clientService";
import { connectDB } from "@/app/lib/mongodb";
import { IUser } from "@/app/lib/backend/models/user.model";
import { User } from "@/app/lib/backend/models/user.model";
import { Branch } from "@/app/lib/backend/models/branch.model";

import {
  LoanApplicationSchema,
  ILoanApplication,
} from "@/app/lib/backend/models/loans.model";

import {
  validateNumber,
  createResponse,
  validateFields,
} from "@/app/lib/helperFunctions";
import { Client, IClient } from "@/app/lib/backend/models/client.model";
import mongoose from "mongoose";
import { generateFileName } from "../loans/route";
import { getUserId } from "../auth/route";
import { ActivitymanagementService } from "@/app/lib/backend/services/ActivitymanagementService";
import { uploadToCloudinary, getArrayBuffer, saveFile } from "@/app/lib/serverFunctions";
await connectDB();
const clientService = new ClientService();
const activitymanagementService = new ActivitymanagementService();



export async function GET(req: NextRequest) {
  try {
    if (!mongoose.models.LoanApplication) {
      mongoose.model<ILoanApplication>(
        "LoanApplication",
        LoanApplicationSchema
      );
    }

    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const clientId = searchParams.get("clientId");
    const search = searchParams.get("search");
    const query = searchParams.get("query");

    if (query && query.length > 0) {
      console.log(query);
      try {
        const clients = await Client.find({
          $and: [
            {
              $or: [
                { first_name: { $regex: query, $options: "i" } },
                { last_name: { $regex: query, $options: "i" } },
                { systemId: { $regex: query, $options: "i" } },
              ],
            },
            { client_status: "active" },
          ],
        })
          .populate("loans")
          .populate({ path: "branch", select: ["branchName"] })
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
          .lean();

        // const matchedLoans = loans.filter(loan => loan.client !== null);
        if (clients.length === 0) {
          return NextResponse.json(
            {
              success: false,
              message: "No loans found matching the search criteria",
              data: [],
            },
            { status: 404, headers: { "Cache-Control": "no-store" } }
          );
        }

        return NextResponse.json(
          { success: true, data: clients },
          { status: 200, headers: { "Cache-Control": "no-store" } }
        );
      } catch (error) {
        console.error("Error searching loans:", error);
        return createResponse(false, "500", "Error searching loans", {});
      }
    }
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
      const allClients = await Client.find({}).populate("loans");
      return NextResponse.json(
        { success: true, message: "Fetched all clients.", data: allClients },
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

    const [users, totalUsers] = await Promise.all([
      Client.find({})
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("staff")
        .populate("branch"),
      Client.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    const pagination = {
      totalUsers,
      currentPage: page,
      totalPages,
    };

    return NextResponse.json(
      { success: true, message: "", data: users, pagination },
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

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type");
  if (!contentType?.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Unsupported Content-Type" },
      { status: 400 }
    );
  }
  try {
    const body = await req.formData();
    const passport: File | null = body.get("passport") as unknown as File;
    // Define the keys to exclude
    const excludedKeys = new Set([
      "mobile",
      "dob",
      "idNumber",
      "staff",
      "passport",
    ]);

    const validateMessage = validateFields(body, excludedKeys);
    if (validateMessage) {
      return createResponse(false, "001", validateMessage, {});
    }
    const isNumberValid = validateNumber(body.get("mobile") as string);

    if (!isNumberValid)
      return createResponse(false, "001", "Mobile number is invalid", {});

    const [staff, branch] = await Promise.all([
      User.findOne({ username: body.get("staff") }),
      Branch.findOne({ branchName: body.get("branch") }),
    ]);

    if (!staff) return createResponse(false, "001", "Staff does not exist", {});

    if (!branch)
      return createResponse(false, "001", "Branch does not exist", {});

    let newFileName: string = "";
    if (passport.name) {
      if (process.env.NODE_ENV === "development") {
        const result = await generateFileName(passport);
        newFileName = result.newFileName;
        await saveFile(newFileName, result.buffer);
        console.log(newFileName)
      } else {
        const buffer = await getArrayBuffer(passport);
        const result = await uploadToCloudinary(buffer, "uploads");
        newFileName = (result as { secure_url: string }).secure_url;
        console.log(newFileName);
      }
    }

    const systemId: string = clientService.generateClientSystemID();
    const client = {
      first_name: body.get("firstName") as string,
      last_name: body.get("lastName") as string,
      nick_name: body.get("nickName") as string,
      title: body.get("title") as string,
      branch: branch._id as mongoose.Types.ObjectId, // Ensure branch is fetched correctly
      union: body.get("union") as string,
      unionLocation: body.get("unionLocation") as string,
      mobile: body.get("mobile") as string,
      residence: body.get("residence") as string,
      dob: new Date(body.get("dob") as string), // Parse as Date for better handling
      idType: body.get("idType") as string,
      idNumber: body.get("idNumber") as string,
      avarta: newFileName, // Make sure `newFileName` is defined and sanitized
      staff: staff._id as mongoose.Types.ObjectId, // Ensure staff is fetched correctly
      maritalStatus: body.get("maritalStatus") as "married" | "single" | "divorced" | "widowed" | undefined, // Ensure correct type
      systemId: systemId, // Ensure this is generated uniquely
      gender: (body.get("gender") as "male" | "female" | "others" | undefined)?.toLowerCase(), // Ensure correct type
    };

    const newClient = await clientService.create(client as any);
    const userId = await getUserId();

    await activitymanagementService.createActivity(
      "New Client Addition",
      new mongoose.Types.ObjectId(userId)
    );
    return createResponse(true, "001", "Client added successfully", newClient);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id: string | any = searchParams.get("id");

    const client = await clientService.findById(id);
    if (!client)
      return createResponse(false, "001", "Client does not exists");

    const deleteClient = await clientService.delete(id);
    if (!deleteClient)
      return createResponse(false, "001", "Something happened", {});
    const userId = await getUserId();

    await activitymanagementService.createActivity(
      "Client Deletion",
      new mongoose.Types.ObjectId(userId)
    );
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

export async function PUT(req: NextRequest) {
  const contentType = req.headers.get("content-type");
  if (!contentType?.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Unsupported Content-Type" },
      { status: 400 }
    );
  }

  try {
    const body = await req.formData();
    const searchParams = req.nextUrl.searchParams;
    // const id: string | any = searchParams.get("id");
    // if (!id) return createResponse(false, "001", "Client ID is required", {});

    const client = await clientService.findById(body.get('id') as string);
    if (!client) return createResponse(false, "001", "Client not found", {});

    const [staff, branch] = await Promise.all([
      User.findOne({ username: body.get("staff") }),
      Branch.findOne({ branchName: body.get("branch") }),
    ]);

    if (!staff) return createResponse(false, "001", "Staff does not exist", {});
    if (!branch)
      return createResponse(false, "001", "Branch does not exist", {});

    // Utility function to check if a value is non-empty
    const isNotEmpty = (value: unknown) =>
      value !== undefined && value !== null && value !== "";

    // Mapping between formData keys and client object keys
    const fieldMapping: Record<string, string> = {
      firstName: "first_name",
      lastName: "last_name",
      nickName: "nick_name",
      title: "title",
      mobile: "mobile",
      residence: "residence",
      maritalStatus: "maritalStatus",
      gender: "gender",
    };

    // Dynamically construct updatedFields object
    const updatedFields: Partial<typeof client> = {};

    Object.entries(fieldMapping).forEach(([formKey, clientKey]) => {
      const formValue = body.get(formKey);
      if (isNotEmpty(formValue)) {
        (updatedFields as any)[clientKey] = formValue;
      }
    });

    // Handle special cases like file upload
    const passport: File | null = body.get("passport") as unknown as File;
    if (passport.name !== "") {
      const bytes = await passport.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const originalName = passport.name;
      const fileExtension = originalName.substring(
        originalName.lastIndexOf(".")
      );
      const newFileName = `${Date.now()}${fileExtension}`;
      await saveFile(newFileName, buffer);
      updatedFields["avarta"] = newFileName; // Update avatar if a new file is uploaded
    }

    updatedFields["staff"] = staff._id as mongoose.Types.ObjectId;
    updatedFields["branch"] = branch._id as mongoose.Types.ObjectId;
    updatedFields["client_status"] = body.get("clientStatus") as string;

    const updatedClient = await clientService.update(body.get('id') as string, updatedFields);
    const userId = await getUserId();

    await activitymanagementService.createActivity(
      "Client Information Update",
      new mongoose.Types.ObjectId(userId)
    );
    if (!updatedClient) {
      return createResponse(false, "001", "Failed to update client", {});
    }
    return createResponse(
      true,
      "001",
      "Client updated successfully",
      updatedClient
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
export { saveFile };

