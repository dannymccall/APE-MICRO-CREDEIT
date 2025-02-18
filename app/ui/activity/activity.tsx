"use client";
import React, { useState } from "react";


import { useRouter } from "next/navigation";
import { IActivitymanagement } from "@/app/lib/backend/models/activitymanagement.model";
import { formatDate } from "@/app/lib/helperFunctions";
import { IActivities } from "./activityList";


interface ActivityProps {
  activity: IActivities;
}

const Activity: React.FC<ActivityProps> = ({ activity }) => {
 
  return (
    <>
      <tr key={activity._id} className="hover:bg-gray-100 relative">
        <td className="p-2 font-mono font-normal text-gray-700 text-left">{new Date(activity.createdAt).toLocaleString()}</td>
        <td className="p-2 font-mono font-normal text-gray-700 text-left">{activity.activity}</td>
        <td className="p-2 font-mono font-normal text-gray-700 text-left"> {activity.user.first_name} {activity.user.other_names} {activity.user.last_name}</td>
      </tr>
    </>
  );
};

export default Activity;
