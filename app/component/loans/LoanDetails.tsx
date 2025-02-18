import { ILoanApplication } from "@/app/lib/backend/models/loans.model";
import { formatDate } from "@/app/lib/helperFunctions";
import React from "react";
import { CgDetailsMore } from "react-icons/cg";

const LoanAccountDetails = ({
  loan,
  activeTab,
}: {
  loan: ILoanApplication | any;
  activeTab: number;
}) => {
  return (
    <div
      className={`w-full flex flex-col flex-wrap ${
        activeTab === 0 ? "opacity-100" : "opacity-0"
      } transition-opacity duration-75 ease-in-out`}
    >
      <div className="w-full h-full flex flex-col gap-3">
        <div className="w-full h-full flex flex-row  justify-between px-10">
          <div className="w-full">
            <p className="text-base font-sans font-semibold">Loan Product</p>
            <span className="text-sm">{loan.loanProduct}</span>
          </div>
        </div>
      </div>
      <div className="divider"></div>
      <div className="w-full h-full flex flex-col gap-3 justify-between px-10">
        <p className="text-lg font-sans font-bold">Terms</p>
        <div className="w-full h-full flex flex-row justify-between desktop:flex-row laptop:flex-row phone:flex-col gap-4">
          <div className="w-full">
            <p className="text-base font-sans font-semibold flex items-center">
              Principal
            </p>
            <span className="text-sm">
              GHS {Number(loan.principal).toFixed(2)}
            </span>
          </div>
          <div className="w-full">
            <p className="text-base font-sans font-semibold flex items-center gap-3">
              Fund
            </p>
            <span>{loan.fund}</span>
          </div>
          <div className="w-full">
            <p className="text-sm font-sans font-semibold flex items-center gap-3">
              Loan Terms
            </p>
            <span>{loan.loanTerms}</span>
          </div>
          <div className="w-full">
            <p className="text-base font-sans font-semibold flex items-center gap-3">
              Repayment Frequency
            </p>
            <span className="text-sm">{loan.repaymentFrequency}</span>
          </div>
          <div className="w-full">
            <p className="text-base font-sans font-semibold flex items-center gap-3">
              Type
            </p>
            <span className="text-sm">{loan.type}</span>
          </div>
          <div className="w-full">
            <p className="text-base font-sans font-semibold flex items-center gap-3">
              Inerest Rate
            </p>
            <span>{loan.monthlyInterest}%</span>
          </div>
          <div className="w-full">
            <p className="text-base font-sans font-semibold flex items-center gap-3">
              Expected Disbursement Date
            </p>
            <span className="text-sm">
              {formatDate(loan.expectedDisbursementDate)}
            </span>
          </div>
        </div>
      </div>
      <div className="divider"></div>
      <div className="w-full h-full flex flex-col gap-3 justify-between px-10">
        <p className="text-lg font-sans font-bold">Settings</p>
        <div className="w-full h-full flex flex-row justify-between desktop:flex-row laptop:flex-row phone:flex-col gap-4">
          <div className="w-full">
            <p className="text-base font-sans font-semibold">Loan Officer</p>
            <span className="text-sm">
              {loan.loanOfficer.first_name} {loan.loanOfficer.other_names}{" "}
              {loan.loanOfficer.last_name}
            </span>
          </div>
          <div className="w-full">
            <p className="text-base font-sans font-semibold flex items-center gap-3">
              Loan Purpose
            </p>
            <span>{loan.loanPurpose}</span>
          </div>
          <div className="w-full">
            <p className="text-base font-sans font-semibold flex items-center gap-3">
              Expected First Repayment Date
            </p>
            <span className="text-sm">{formatDate(loan.nextPayment)}</span>
          </div>
        </div>
      </div>
      <div className="divider"></div>
    </div>
  );
};

export default LoanAccountDetails;
