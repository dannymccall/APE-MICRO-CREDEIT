"use client";
import React, { useState } from "react";

import Modal from "@/app/component/Modal";
import Toast from "@/app/component/toast/Toast";
import { FaCircleCheck } from "react-icons/fa6";
import { makeRequest, toCapitalized } from "@/app/lib/helperFunctions";
import { useRouter } from "next/navigation";
import { ILoanApplication } from "@/app/lib/backend/models/loans.model";
import { IoIosArrowRoundForward } from "react-icons/io";

import Link from "next/link";
import { useLogginIdentity } from "@/app/lib/customHooks";

interface LoanProps {
  loan: ILoanApplication | any;
  loanOfficer: string;
}

const Loan: React.FC<LoanProps> = ({ loan, loanOfficer }) => {
  const [showToast, setShowToast] = useState<boolean>(false);
 

  const router = useRouter();

  return (
    <>
      {showToast && (
        <Toast
          message={"User deleted successfully"}
          Icon={FaCircleCheck}
          title="User Deletion Response"
        />
      )}

      <tr key={loan.id} className="hover:bg-gray-100 relative">
        <td className="p-2">{loan.systemId}</td>
        <td className="p-2">{loan.loanProduct}</td>
        <td className="p-2">{Number(loan.principal.toFixed(2))}</td>
        <td className="p-2">{loanOfficer}</td>
        <td className="p-2"> {loan.monthlyInterest}</td>
        <td className="p-2">
          {" "}
          <span
            className={`${
              loan.paymentStatus === "not completed"
                ? "bg-orange-200"
                : loan.paymentStatus === "completed"
                ? "bg-green-200"
                : "bg-red-200"
            } p-1 rounded`}
          >
            {" "}
            {toCapitalized(loan.paymentStatus)}
          </span>{" "}
        </td>

        <td className="p-2 relative">
          <Link
            href={`/view-loan/${loan.systemId}`}
            className="text-violet-600 hover:text-violet-800 flex gap-3 items-center link-btn"
          >
            View Full Details <IoIosArrowRoundForward size={20} className="relative icon-move-left"/>
          </Link>
        </td>
      </tr>
    </>
  );
};

export default Loan;
