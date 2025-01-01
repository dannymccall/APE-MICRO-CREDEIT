import { NextResponse, type NextRequest } from "next/server";
import { Db, Collection } from "mongodb";
import { UserService } from "@/app/lib/backend/services/userService";
import { connectDB } from "@/app/lib/mongodb";
import { createResponse } from "@/app/lib/utils";
import { IUser } from "@/app/lib/backend/models/user.model";
import { User } from "@/app/lib/backend/models/user.model";
// async function getUserService(collectionName: any) {
//   const client = await clientPromise; // Reuse the MongoDB client
//   const db: Db = client.db("microservice"); // Replace "test" with your database name
//   const collection: Collection = db.collection(collectionName); // Replace "movies" with your collection name
//   return new UserService(collection);
// }

await connectDB();
const userService = new UserService();

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    if (!pageParam && !limitParam) {
      const allStaff = await User.find({});
      console.log(allStaff)
      return createResponse(true, "200", "Fetched all staff.", allStaff);
    }

    const page = parseInt(pageParam || "1", 10);
    const limit = parseInt(limitParam || "10", 10);

    const users: IUser[] = await User.find({})
      .skip((page - 1) * limit)
      .limit(limit);

    const totalUsers: number | any = await User.countDocuments();
    const totalPages: number | any = Number(Math.ceil(totalUsers / limit));

    const pagination = {
      totalUsers,
      currentPage: page,
      totalPages: totalPages,
    };
    return createResponse(true, "200", "", users, pagination);
  } catch (e) {
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    console.log({ body });

    for (const [key, value] of Object.entries(body)) {
      if (key !== "dob" && key !== "roles") {
        const validateMessage = userService.validateString(
          value as string,
          key
        );
        console.log(validateMessage);
        if (validateMessage) {
          return createResponse(false, "001", validateMessage, {});
        }
      }
    }

    const password = userService.generateSecurePassword(8);
    // Continue processing if all validations pass

    const username = userService.generateUsername(
      body.firstName,
      body.lastName,
      body.otherNames
    );

    console.log({ username }, { password });
    const hashedPassword = await userService.generateHashPassword(password);

    const fetchedUser = await userService.findOne({ username });

    if (fetchedUser)
      return createResponse(false, "001", "User already exists", {});

    const newUser = {
      first_name: body.firstName,
      last_name: body.lastName,
      other_names: body.otherNames,
      dob: body.dob,
      sex: body.sex.toLowerCase(),
      roles: body.roles.split(","),
      username: username,
      password: hashedPassword,
    };
    console.log({ newUser });

    const registeredUser = await userService.create(newUser);

    return createResponse(
      true,
      "001",
      "User registered successfully",
      registeredUser
    );
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

    const user = await userService.findById(id);
    if (!user)
      return createResponse(false, "001", "User does not exists", user);

    const deletedUser = await userService.delete(id);
    if (!deletedUser)
      return createResponse(false, "001", "Something happened", {});

    return createResponse(
      true,
      "001",
      "User deleted successfully",
      deletedUser
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

export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const searchParams = req.nextUrl.searchParams;
    const id: string | any = searchParams.get("id");

    const updateUser = {
      first_name: body.firstName,
      last_name: body.lastName,
      other_names: body.otherNames,
      dob: body.dob,
      sex: body.sex.toLowerCase(),
      roles: body.roles.split(","),
      username: body.username,
    };

    const user = await userService.findById(id);
    if (!user)
      return createResponse(false, "001", "User does not exists", user);

    const updatedUser = await userService.update(id, updateUser);
    if (!updatedUser)
      return createResponse(false, "001", "Something happened", {});

    return createResponse(
      true,
      "001",
      "User deleted successfully",
      updatedUser
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
