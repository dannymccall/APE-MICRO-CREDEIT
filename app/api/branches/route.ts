import { NextRequest, NextResponse } from "next/server";
import { Db, Collection } from "mongodb";
import { BranchService } from "@/app/lib/backend/services/branchService";
import { connectDB } from "@/app/lib/mongodb";
import { createResponse } from "@/app/lib/helperFunctions";
import { IBranch } from "@/app/lib/backend/models/branch.model";
import { Branch } from "@/app/lib/backend/models/branch.model";

// async function getUserService(collectionName: any) {
//   const client = await clientPromise; // Reuse the MongoDB client
//   const db: Db = client.db("microservice"); // Replace "test" with your database name
//   const collection: Collection = db.collection(collectionName); // Replace "movies" with your collection name
//   return new UserService(collection);
// }

await connectDB();
const branchService = new BranchService();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    if (!pageParam && !limitParam) {
      const allBranches = await Branch.find({});
      return createResponse(true, "200", "Fetched all branches.", allBranches);
    }

    const page = parseInt(pageParam || "1", 10);
    const limit = parseInt(limitParam || "10", 10);
    
    const branches: IBranch[] = await Branch.find({})
      .skip((page - 1) * limit)
      .limit(limit);

    const totalBranches: number | any = await Branch.countDocuments();
    const totalPages: number | any = Number(Math.ceil(totalBranches / limit));

    const pagination = {
      totalBranches,
      currentPage: page,
      totalPages: totalPages,
    };
    return createResponse(true, "200", "", branches, pagination);
  } catch (e) {
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // console.log({ body });

    const { branchName } = body;

    const branch = await branchService.findOne({ branchName });
    if (branch)
      return createResponse(false, "001", "Branch already exists", {});

    const branchCode = branchService.generateBranchCode(branchName);
    const newBranch = await branchService.create({ branchName, branchCode });
    return createResponse(
      true,
      "001",
      "Branch add successfully",
      newBranch,
      {},
      200
    );
  } catch (error) {
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

    const branch = await branchService.findById(id);
    if (!branch)
      return createResponse(false, "001", "User does not exists", branch);

    const deletedBranch = await branchService.delete(id);
    if (!deletedBranch)
      return createResponse(false, "001", "Something happened", {});

    return createResponse(
      true,
      "001",
      "Branch deleted successfully",
      deletedBranch
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
// return NextResponse.json({ data: "good" }, { status: 200 });
// console.log(fetchedUser)
// return NextResponse.json({ fetchedUser }, { status: 200 });

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const searchParams = req.nextUrl.searchParams;
    const id: string | any = searchParams.get("id");

    const updateBranch = {
      branchName: body.branchName,
     
    };

    const branch = await branchService.findById(id);
    if (!branch)
      return createResponse(false, "001", "User does not exists", branch);

    const updatedBranch = await branchService.update(id, updateBranch);
    if (!updatedBranch)
      return createResponse(false, "001", "Something happened", {});

    return createResponse(
      true,
      "001",
      "Branch updated successfully",
      updatedBranch
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
