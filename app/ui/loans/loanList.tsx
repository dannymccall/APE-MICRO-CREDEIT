"use client";

import React from "react";
import { IoCaretForward } from "react-icons/io5";
import { IoCaretBackSharp } from "react-icons/io5";
import { ILoanApplication } from "@/app/lib/backend/models/loans.model";
import Loan from "./Loan";


interface LoanListProps {
  loans: ILoanApplication[];
  onDelete: () => void;
  currentPage?: number;
  totalPages: number | 1;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  editUser: (user: ILoanApplication, id: string) => void,
}
const LoanList: React.FC<LoanListProps> = ({
  loans,
  onDelete,
  currentPage,
  totalPages,
  setCurrentPage,
  editUser
}) => {
  const breadcrumbsLinks = [
    { name: "Dashboard", href: "/dashboard" },
    {
      name: "add-user",
      href: "/addUser",
    },
  ];

  return (
    <div>
      <div className="w-full h-full bg-white relative shadow-md">
        <table className="table">
          {/* head */}
          <thead className="relative">
            <tr className="relative bg-violet-200">
              <th className="text-base font-sans font-medium text-gray-700 text-left p-2">
                System ID
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Loan Product
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Principle
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Loan Officer
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Interest Rate
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Loan Payment Status
              </th>
              <th className="text-base font-sans font-medium text-gray-700 p-2">
                Actions{" "}
              </th>
            </tr>
          </thead>
          <tbody className="relative">
            {loans.map((loan: ILoanApplication | any) => (
              <Loan key={loan._id} loan={loan} />
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

export default LoanList;
