import { NextResponse, type NextRequest } from "next/server";
import { Db, Collection } from "mongodb";
import { UserService } from "@/app/lib/backend/services/userService";
import { connectDB } from "@/app/lib/mongodb";
import { createResponse } from "@/app/lib/helperFunctions";
import { IUser } from "@/app/lib/backend/models/user.model";
import { User } from "@/app/lib/backend/models/user.model";
import nodemailer, { Transporter } from "nodemailer";
import { saveFile } from "../clients/route";
import { generateFileName } from "../loans/route";
import { getUserId } from "../auth/route";
import mongoose from "mongoose";
import { ActivitymanagementService } from "@/app/lib/backend/services/ActivitymanagementService";
import {
  getArrayBuffer,
  uploadToCloudinary,
} from "@/app/lib/serverFunctions";
// async function getUserService(collectionName: any) {
//   const client = await clientPromise; // Reuse the MongoDB client
//   const db: Db = client.db("microservice"); // Replace "test" with your database name
//   const collection: Collection = db.collection(collectionName); // Replace "movies" with your collection name
//   return new UserService(collection);
// }

await connectDB();
const userService = new UserService();
const activitymanagementService = new ActivitymanagementService();
export interface EmailPayload {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(mailOptions: EmailPayload) {
  try {
    const transporter: Transporter = nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_SMTP_HOST, // e.g., 'smtp.gmail.com'
      port: parseInt(process.env.NEXT_PUBLIC_SMTP_PORT || "465", 10), // Port (default: 587)
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.NEXT_PUBLIC_SMTP_USER, // SMTP username
        pass: process.env.NEXT_PUBLIC_SMTP_PASS, // SMTP password
      },
    });

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info);
    return info;
  } catch (error: any) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const query = searchParams.get("query");
    if (query) {
      const users: IUser[] = await User.find({
        $or: [
          { first_name: { $regex: query, $options: "i" } },
          { last_name: { $regex: query, $options: "i" } },
          { other_names: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      });

      if (users.length === 0)
        return createResponse(false, "200", "No user found", []);
      return createResponse(true, "200", "Fetched all staff.", users);
    }

    if (!pageParam && !limitParam) {
      const allStaff = await User.find({});
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
    return NextResponse.json(
      { success: true, data: users, pagination },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    for (const [key, value] of Object.entries(body)) {
      if (key !== "dob" && key !== "roles" && key !== "email") {
        const validateMessage = userService.validateString(
          value as string,
          key
        );
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
      email: body.email,
    };

    const registeredUser = await userService.create(newUser);
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
            <h1 style="margin: 0; font-size: 24px;">Welcome to APE Credit!</h1>
          </div>
          
          <!-- Body -->
          <div style="padding: 20px; color: #333333;">
            <p style="margin: 10px 0; line-height: 1.5;">Dear <strong>${body.firstName} ${body.lastName}</strong>,</p>
            <p style="margin: 10px 0; line-height: 1.5;">Thank you for joining <strong>APE Credit</strong>. Below are your login credentials:</p>
            
            <!-- Credentials Section -->
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 5px 0; font-size: 16px; color: #555555;"><strong>Username:</strong> ${username}</p>
              <p style="margin: 5px 0; font-size: 16px; color: #555555;"><strong>Password:</strong> ${password}</p>
            </div>
            
            <p style="margin: 10px 0; line-height: 1.5;">We recommend changing your password after your first login for security purposes.</p>
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
    if (registeredUser) {
      const mailOptions: EmailPayload = {
        from: '"APE CREDIT" no-reply@gmail.com', // Sender address,
        to: body.email, // Recipient address
        subject: "Welcome on Board", // Subject line
        text: "", // Plain text body
        html: html, // HTML body (optional)
      };
      await sendEmail(mailOptions);
    }
    const userId = await getUserId();
    await activitymanagementService.createActivity(
      "User Registration",
      new mongoose.Types.ObjectId(userId)
    );
    return createResponse(
      true,
      "001",
      "User registered successfully",
      registeredUser
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

    const user = await userService.findById(id);
    if (!user)
      return createResponse(false, "001", "User does not exists", user);

    const deletedUser = await userService.delete(id);
    if (!deletedUser)
      return createResponse(false, "001", "Something happened", {});
    const userId = await getUserId();

    await activitymanagementService.createActivity(
      "User Deleted",
      new mongoose.Types.ObjectId(userId)
    );
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

export async function PUT(req: NextRequest) {
  try {
    let body: any;
    const contentType = req.headers.get("content-type");
    const searchParams = req.nextUrl.searchParams;
    const id: string | any = searchParams.get("id");
    const userId = await getUserId();

    if (contentType?.includes("multipart/form-data")) {
      console.log("hello");
      body = await req.formData();
      const passport = body.get("profile-picture");
      if (!passport.name)
        return createResponse(false, "400", "Please file path is needed");

      const user = await userService.findOne({ _id: id });
      if (!user) return createResponse(false, "400", "User does not exist");

      let newFileName: string = "";
      if (process.env.NODE_ENV === "development") {
        const result = await generateFileName(passport);
        newFileName = result.newFileName;
        await saveFile(newFileName, result.buffer);
        console.log(newFileName);
      } else {
        const buffer = await getArrayBuffer(passport);
        const result = await uploadToCloudinary(buffer, "uploads");
        newFileName = (result as { secure_url: string }).secure_url;
        console.log(newFileName);
      }
      const updatedProfilePicture = await userService.update(id, {
        avarta: newFileName,
      });
      if (!updatedProfilePicture)
        return createResponse(false, "400", "Something happend");

      await activitymanagementService.createActivity(
        "User Details Update",
        new mongoose.Types.ObjectId(userId)
      );

      return createResponse(
        true,
        "200",
        "Profile picture set successfully",
        updatedProfilePicture.avarta
      );
    } else {
      console.log("hi");
      body = await req.json();
    }

    console.log(body);

    const updateUser = {
      first_name: body.firstName,
      last_name: body.lastName,
      other_names: body.otherNames,
      dob: body.dob,
      sex: body.sex.toLowerCase(),
      roles: body.roles.split(","),
      username: body.username,
      email: body.email,
    };

    const user = await userService.findById(body.id);
    if (!user)
      return createResponse(false, "001", "User does not exists", user);

    const updatedUser = await userService.update(body.id, updateUser);
    if (!updatedUser)
      return createResponse(false, "001", "Something happened", {});
    await activitymanagementService.createActivity(
      "User Details Update",
      new mongoose.Types.ObjectId(userId)
    );

    return createResponse(
      true,
      "001",
      "User updated successfully",
      updatedUser
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
