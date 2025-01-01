import { NextResponse, type NextRequest } from "next/server";
import { ClientService } from "@/app/lib/backend/services/clientService";
import { connectDB } from "@/app/lib/mongodb";
import { IUser } from "@/app/lib/backend/models/user.model";
import { User } from "@/app/lib/backend/models/user.model";
import { Branch } from "@/app/lib/backend/models/branch.model";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";
import {
  validateNumber,
  createResponse,
  validateFields,
} from "@/app/lib/utils";
import { Client, IClient } from "@/app/lib/backend/models/client.model";

await connectDB();
const clientService = new ClientService();

export const saveFile = async (fileName: string, buffer: Buffer) => {
  try {
    // Define the directory and file path
    const uploadDir = join(process.cwd(), "public", "uploads");
    const filePath = join(uploadDir, fileName);

    // Ensure the directory exists
    await mkdir(uploadDir, { recursive: true });

    // Write the file
    await writeFile(filePath, buffer);

    console.log(`File saved to ${filePath}`);
  } catch (error) {
    console.error("Error saving file:", error);
    throw error;
  }
};

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const clientId = searchParams.get("clientId");

    if (clientId) {
      const client = await Client.findOne({ systemId: clientId })
        .populate("staff")
        .populate("branch");

      return NextResponse.json(
        { success: true, message: "Generated", data: client },
        {
          status: 200,
          headers: {
            'Cache-Control': 'no-store',  // Prevent caching
          },
        }
      );
    }

    if (!pageParam && !limitParam) {
      const allClients = await Client.find({});
      return NextResponse.json(
        { success: true, message: "Fetched all clients.", data: allClients },
        {
          status: 200,
          headers: {
            'Cache-Control': 'no-store',  // Prevent caching
          },
        }
      );
    }

    const page = parseInt(pageParam || "1", 10);
    const limit = parseInt(limitParam || "10", 10);

    const users = await Client.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("staff")
      .populate("branch");

    const totalUsers = await Client.countDocuments();
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
          'Cache-Control': 'no-store',  // Prevent caching
        },
      }
    );
  } catch (e) {
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
    const body = await req.formData();
    const searchParams = req.nextUrl.searchParams;
    const id: string | any = searchParams.get("id");
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

    const bytes = await passport.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = passport.name;
    const fileExtension = originalName.substring(originalName.lastIndexOf("."));
    const newFileName = `${Date.now()}${fileExtension}`;
    await saveFile(newFileName, buffer);

    const systemId: string = clientService.generateClientSystemID();
    console.log({ body, systemId });
    const client = {
      first_name: body.get("firstName") as string,
      last_name: body.get("lastName") as string,
      nick_name: body.get("nickName") as string,
      title: body.get("title") as string,
      branch: branch._id, // Ensure branch is fetched correctly
      union: body.get("union") as string,
      unionLocation: body.get("unionLocation") as string,
      mobile: body.get("mobile") as string,
      residence: body.get("residence") as string,
      dob: new Date(body.get("dob") as string), // Parse as Date for better handling
      idType: body.get("idType") as string,
      idNumber: body.get("idNumber") as string,
      avarta: newFileName, // Make sure `newFileName` is defined and sanitized
      staff: staff._id, // Ensure staff is fetched correctly
      maritalStatus: (body.get("maritalStatus") as string).toLowerCase(), // Prefer explicit type over `any`
      systemId: systemId, // Ensure this is generated uniquely
      gender: (body.get("gender") as string).toLowerCase(), // Lowercase conversion
    };

    const newClient = await clientService.create(client);

    return createResponse(true, "001", "Client added successfully", newClient);
  } catch (error) {
    console.error("Error handling POST request:", error);
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


export async function PUT(req: NextRequest, res: NextResponse) {
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
    const id: string | any = searchParams.get("id");
    if (!id) return createResponse(false, "001", "Client ID is required", {});

    const client = await clientService.findById(id);
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
        updatedFields[clientKey] = formValue;
      }
    });


    // Handle special cases like file upload
    const passport: File | null = body.get("passport") as unknown as File;
    if (passport.name !== "") {
      const bytes = await passport.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const originalName = passport.name;
      const fileExtension = originalName.substring(originalName.lastIndexOf("."));
      const newFileName = `${Date.now()}${fileExtension}`;
      await saveFile(newFileName, buffer);
      updatedFields["avarta"] = newFileName; // Update avatar if a new file is uploaded
    }

    updatedFields["staff"] = staff._id;
    updatedFields["branch"] = branch._id
    const updatedClient = await clientService.update(id, updatedFields);

    return createResponse(true, "001", "Client updated successfully", updatedClient);
  } catch (error) {
    console.error("Error handling PUT request:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
