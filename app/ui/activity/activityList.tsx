"use client";

import React from "react";
import { IUser } from "@/app/lib/backend/models/user.model";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import { IoCaretForward } from "react-icons/io5";
import { IoCaretBackSharp } from "react-icons/io5";
import Activity from "./activity";


export interface IActivities {
  user: {
    first_name: string,
    other_names: string,
    last_name: string
  },
  activity: string,
  createdAt: string,
  _id: string
}
interface ActiviyListProps {
  activities: IActivities[];
  currentPage?: number;
  totalPages: number | 1;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}
const ActivityList: React.FC<ActiviyListProps> = ({
  activities,
  currentPage,
  totalPages,
  setCurrentPage,
  
}) => {
  const breadcrumbsLinks = [
    { name: "Dashboard", href: "/dashboard" },
    {
      name: "add-user",
      href: "/addUser",
    },
  ];

  return (
    <div className="bg-white w-full">
      <div className="w-full h-full bg-white relative">
        <table className="table">
          {/* head */}
          <thead className="relative">
            <tr className="relative bg-violet-800">
              <th className="text-base font-sans font-medium text-slate-50 text-left p-2">
                Created Date
              </th>
              <th className="text-base font-sans font-medium text-slate-50 p-2">
                Action
              </th>
              <th className="text-base font-sans font-medium text-slate-50 p-2">
                Action Taker
              </th>
            </tr>
          </thead>
          <tbody className="relative">
            {activities.map((activity: IUser | any) => (
              <Activity key={activity._id} activity={activity}/>
            ))}
          </tbody>
        </table>
        <div className="flex items-center gap-4 p-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev: number) => Math.max(prev - 1, 1))
            }
            disabled={currentPage === 1}
          >
            <IoCaretBackSharp className="text-violet-700" />
          </button>
          <span className="font-semibold font-sans">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <IoCaretForward className="text-violet-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityList;
