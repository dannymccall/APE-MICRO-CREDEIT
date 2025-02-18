import { NextRequest, NextResponse } from "next/server";
 import { Activitymanagement } from "@/app/lib/backend/models/activitymanagement.model";
 import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const search = searchParams.get("search");
    const query = searchParams.get("query")
  

    if (!pageParam && !limitParam) {
      const allActivities = await Activitymanagement.find({});
      return NextResponse.json(
        { success: true, message: "Fetched all clients.", data: allActivities },
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

    const loans = await Activitymanagement.find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: "user",
        select: ["first_name", "other_names", "last_name"],
      })

    const totalLoans = await Activitymanagement.countDocuments();
    const totalPages = Math.ceil(totalLoans / limit);

    const pagination = {
      totalLoans,
      currentPage: page,
      totalPages,
    };


    revalidatePath("activities")
    return NextResponse.json(
      { success: true, message: "", data: loans, pagination },
      {
        status: 200,
       headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=30", // Cache for 1 min
      }
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
