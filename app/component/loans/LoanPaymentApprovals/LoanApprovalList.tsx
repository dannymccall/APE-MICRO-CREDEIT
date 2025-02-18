"use client";

import React from "react";
import { IClient } from "@/app/lib/backend/models/client.model";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import { IoCaretForward } from "react-icons/io5";
import { IoCaretBackSharp } from "react-icons/io5";
import { LoanApprovalProps } from "./LoanApproval";
import LoanApproval from "./LoanApproval";

interface LoanApprovalListProps {
  pendingLoans: LoanApprovalProps[];
  currentPage?: number;
  totalPages: number | 1;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onApprove: () => void
}
const LoanApprovalList: React.FC<LoanApprovalListProps> = ({
  pendingLoans,
  currentPage,
  totalPages,
  setCurrentPage,
  onApprove
}) => {


  return (
    <div className="w-full bg-white">
      <div className="w-full relative overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead className="relative">
            <tr className="relative bg-violet-200">
              <th className="text-sm font-sans font-medium text-gray-700 text-left p-2">
                Client
              </th>
              <th className="text-sm font-sans font-medium text-gray-700 p-2">
                Payment Date
              </th>
              <th className="text-sm font-sans font-medium text-gray-700 p-2">
                Expected Amount
              </th>
              <th className="text-sm font-sans font-medium text-gray-700 p-2">
                Amount Paid
              </th>
              <th className="text-sm font-sans font-medium text-gray-700 p-2">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="relative">
            {pendingLoans.map((pendingLoan: LoanApprovalProps | any) => (
              <LoanApproval key={pendingLoan._id}  pendingLoan={pendingLoan} onApprove={onApprove}/>
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

export default LoanApprovalList;
