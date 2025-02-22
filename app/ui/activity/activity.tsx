"use client";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
import { IActivitymanagement } from "@/app/lib/backend/models/activitymanagement.model";
import { formatDate } from "@/app/lib/helperFunctions";


interface IActivity {
  activity: {
    _id:string
    createdAt:string,
    activity: string;
    userDetails: {
      first_name: string,
      other_names:string,
      last_name:string
    },
  }

  }
// interface ActivityProps {
//   activity: IActivity;
// }

const Activity: React.FC<IActivity> = ({ activity }) => {
  return (
    <>
      <tr key={activity._id} className="hover:bg-gray-100 relative">
        <td className="p-2 font-mono font-normal text-gray-700 text-left">
          {new Date(activity.createdAt).toLocaleString()}
        </td>
        <td className="p-2 font-mono font-normal text-gray-700 text-left">
          {activity.activity}
        </td>
        <td className="p-2 font-mono font-normal text-gray-700 text-left">
          {activity.userDetails
            ? `${activity.userDetails.first_name} ${
                activity.userDetails.other_names || ""
              } ${activity.userDetails.last_name}`
            : "Unknown User"}
        </td>
      </tr>
    </>
  );
};

export default Activity;
