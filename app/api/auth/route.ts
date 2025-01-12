import { NextResponse, type NextRequest } from "next/server";
import { Db, Collection } from "mongodb";
import { UserService } from "@/app/lib/backend/services/userService";
import { connectDB } from "@/app/lib/mongodb";
import { createResponse } from "@/app/lib/utils";
import { IUser } from "@/app/lib/backend/models/user.model";
import { User } from "@/app/lib/backend/models/user.model";
import { createSession } from "@/app/lib/session/sessions";
import { encryptData } from "@/app/lib/session/security";
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
    const page: number | any = parseInt(searchParams.get("page") || "1", 10);
    const limit: number | any = parseInt(searchParams.get("limit") || "10", 10);
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

export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      console.log({ body });
  
      const { username, password } = body;
  
      const user = await userService.findOne({ username });
  
      if (!user) {
        return NextResponse.json(
          createResponse(false, "001", "Invalid Credentials", {}),
          { status: 401 }
        );
      }
  
      const isPasswordValid = await userService.comparePassword(password, user.password);
      console.log({isPasswordValid})
      if (!isPasswordValid) {
        return createResponse(false, "001", "Invalid Credentials", {},{})
      }
      
      // Create a session or token
      await createSession(user);
      await userService.update(user._id, {online_status: 'online'})
  
      // Send response to the client
      return createResponse(true, "001", "User sign-in successful", user, {},200 )
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


export async function PUT(req: NextRequest, res: NextResponse){
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
      username: body.username
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