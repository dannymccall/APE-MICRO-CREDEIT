import { NextResponse, type NextRequest } from "next/server";
import { Db, Collection } from "mongodb";
import { UserService } from "@/app/lib/backend/services/userService";
import { connectDB } from "@/app/lib/mongodb";
import { createResponse } from "@/app/lib/helperFunctions";
import { IUser } from "@/app/lib/backend/models/user.model";
import { User } from "@/app/lib/backend/models/user.model";
import { createSession } from "@/app/lib/session/sessions";
import { encryptData, decrypt } from "@/app/lib/session/security";
import { getSession } from "@/app/lib/session/sessions";
import { ActivitymanagementService } from "@/app/lib/backend/services/ActivitymanagementService";
import { cookies } from "next/headers";
import { EmailPayload, sendEmail } from "../users/route";
import mongoose from "mongoose";
// async function getUserService(collectionName: any) {
//   const client = await clientPromise; // Reuse the MongoDB client
//   const db: Db = client.db("microservice"); // Replace "test" with your database name
//   const collection: Collection = db.collection(collectionName); // Replace "movies" with your collection name
//   return new UserService(collection);
// }

await connectDB();
const userService = new UserService();
const activitymanagementService = new ActivitymanagementService();


export async function getUserId(){
  const session = (await cookies()).get("session")?.value;
  const payload = (await decrypt(session)) as | {user: {_id: string}} | undefined;
  return payload?.user._id;
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const page: number | any = parseInt(searchParams.get("page") || "1", 10);
    const limit: number | any = parseInt(searchParams.get("limit") || "10", 10);
    const service = searchParams.get("service");
    if (service && service === "fetchUser") {
      const session = (await cookies()).get("session")?.value;
      const payload = (await decrypt(session)) as
        | { user: { username: string } }
        | undefined;

        console.log(payload)
      if (!payload) {
        return NextResponse.json({ error: "Invalid session" }, { status: 401 });
      }

      const user = await User.findOne({
        username: payload.user.username,
      }).select("first_name last_name other_names username roles dob sex online_status avarta email");
      console.log(user)
      return NextResponse.json(user);
    }
    // if(username){
    //   const user = await userService.findOne(username);
    //   return NextResponse.json(user)
    // }

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

    const isPasswordValid = await userService.comparePassword(
      password,
      user.password
    );
    console.log({ isPasswordValid });
    if (!isPasswordValid) {
      return createResponse(false, "001", "Invalid Credentials", {}, {});
    }

    // Create a session or token
    await createSession(user);
    await userService.update(user._id, { online_status: "online" });

    // Send response to the client

    await activitymanagementService.createActivity("Login Activity", user._id);
    return createResponse(
      true,
      "001",
      "User sign-in successful",
      user,
      {},
      200
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

    const userId = await getUserId();
    await activitymanagementService.createActivity("User Deleted",new mongoose.Types.ObjectId(userId))
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
    const changePassword = searchParams.get("changePassword");

    if (changePassword) {
      const user = await userService.findOne({ username: body["username"] });
      if (!user) return createResponse(false, "001", "Invalid Credentials", {});

      const isPasswordMatch = await userService.comparePassword(
        body["current_password"],
        user.password
      );
      console.log({ isPasswordMatch });

      if (!isPasswordMatch)
        return createResponse(false, "001", "Current Password is Invalid", {});

      const newPassword = await userService.generateHashPassword(
        body["password"]
      );

      if (newPassword) {
        await userService.update(user._id, { password: newPassword });

        const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome Email</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <!-- Header -->
          <div style="background-color: #007bff; color: #ffffff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Password Changed</h1>
          </div>
          
          <!-- Body -->
          <div style="padding: 20px; color: #333333;">
            <p style="margin: 10px 0; line-height: 1.5;">Dear <strong>${user.first_name} ${user.other_names} ${user.last_name}</strong>,</p>
            <p style="margin: 10px 0; line-height: 1.5;">Password Successfully Changed</p>
            <p>Below is your new password:</p>
            
            <!-- Credentials Section -->
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 5px 0; font-size: 16px; color: #555555;"><strong>Password:</strong> ${body['password']}</p>
            </div>
            
            <p style="margin: 10px 0; line-height: 1.5;">We recommend keeping your password safe and secure</p>
            <p style="margin: 10px 0; line-height: 1.5;">If you have any questions or need support, please don’t hesitate to <a href="mailto:support@yourapp.com" style="color: #007bff; text-decoration: none;">contact us</a>.</p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 14px; color: #888888;">
            <p>&copy; 2025 APE Credit. All rights reserved.</p>
            <p><a href="[YourWebsiteURL]" style="color: #007bff; text-decoration: none;">Visit our website</a></p>
          </div>
        </div>
      </body>
    </html>
    `;
   
      const mailOptions: EmailPayload = {
        from: '"APE CREDIT" no-reply@gmail.com', // Sender address,
        to: user.email, // Recipient address
        subject: "Password Change", // Subject line
        text: "", // Plain text body
        html: html, // HTML body (optional)
      };
      await sendEmail(mailOptions);
        return createResponse(true, "200", "Password Successfully Changed");
      }
    }

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
