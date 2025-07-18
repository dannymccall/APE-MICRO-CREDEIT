"use client";

import React from "react";
import { IBranch } from "@/app/lib/backend/models/branch.model";
import { IoCaretForward } from "react-icons/io5";
import { IoCaretBackSharp } from "react-icons/io5";
import Branch from "./branch";
interface UserListProps {
  branches: IBranch[];
  onDelete: () => void;
  currentPage?: number;
  totalPages: number | 1;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  editBranch: (branch: IBranch, id: string) => void,
}
const BranchList: React.FC<UserListProps> = ({
  branches,
  onDelete,
  currentPage,
  totalPages,
  setCurrentPage,
  editBranch
}) => {


  return (
      <div className="w-full h-full bg-white relative overflow-x-auto">
        <table className="table w-full ">
          {/* head */}
          <thead className="relative bg-violet-800">
            <tr className="relative w-full">
              <th className="text-base font-sans font-medium text-slate-50 text-left p-2">
                Branch name
              </th>
              <th className="text-base font-sans font-medium text-slate-50 p-2">
                Branch code
              </th>
            
              <th className="text-base font-sans font-medium text-slate-50 p-2">
                Actions{" "}
              </th>
            </tr>
          </thead>
          <tbody className="relative min-w-full">
            {branches.map((branch: IBranch | any) => (
              <Branch key={branch._id} branch={branch} onDelete={onDelete} editBranch={editBranch} />
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
  
  );
};

export default BranchList;
