"use client";

import {
  formatCurrency,
  formatDate,
  toCapitalized,
} from "@/app/lib/helperFunctions";
import React from "react";
import Modal from "../Modal";
import { IoIosArrowRoundForward } from "react-icons/io";
import Toast from "../toast/Toast";
import { Outstanding } from "../report/Report";
interface schedule {
  nextPayment: string;
  amountToPay: number;
  status: string;
  week: number;
  principalPayment: number;
  interestPayment: number;
  outStandingBalance: number;
  amountPaid: number;
}

interface IPaymentSchedule {
  schedules: schedule[];
  activeTab: number;
  size?: string;
  loan?: any;
  modalOpen: boolean;
  setModalOpen:React.Dispatch<React.SetStateAction<boolean>>
  handleArrearsPayment: (
    amount: number,
    loadId: string,
    nextPayment: string,
    clientId: string
  ) => void;
}
const PaymentSchedule: React.FC<IPaymentSchedule> = ({
  schedules,
  activeTab,
  size,
  loan,
  handleArrearsPayment,
  modalOpen,
  setModalOpen
}) => {
  const totalPrincipalPayment = schedules.reduce((accum, curr) => {
    return accum + Number(curr.principalPayment);
  }, 0);

  const totalInterestPayment = schedules.reduce((accum, curr) => {
    return accum + Number(curr.interestPayment);
  }, 0);

  const totalPayment = totalPrincipalPayment + totalInterestPayment;
  const [amount, setAmount] = React.useState<number>();

  return (
    <>
      <main className="w-full overflow-x-auto">
        <table className={`table ${size} overflow-x-auto`}>
          <thead>
            <tr className="bg-violet-200">
              <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
                Week
              </th>
              <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
                {activeTab === 1
                  ? "Next Payment Date"
                  : activeTab === 2
                  ? "Due Date"
                  : ""}
              </th>
              <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
                Principal
              </th>
              <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
                Interest
              </th>
              <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
                Total
              </th>
              {activeTab === 2 && (
                <>
                  <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
                    Amount Paid
                  </th>
                  <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
                    Amount Left
                  </th>
                </>
              )}
              <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
                Payment Status
              </th>
              {activeTab === 2 && (
                <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule: schedule, index) => (
              <React.Fragment key={index}>
                <tr key={index}>
                  <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
                    Week {schedule.week}
                  </td>
                  <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
                    {formatDate(schedule.nextPayment)}
                  </td>
                  <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
                    {formatCurrency(schedule.principalPayment)}
                  </td>
                  <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
                    {formatCurrency(schedule.interestPayment)}
                  </td>
                  <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
                    {formatCurrency(schedule.amountToPay)}
                  </td>
                  {activeTab === 2 && (
                    <>
                      <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
                        {formatCurrency(schedule.amountPaid)}
                      </td>
                      <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
                        {formatCurrency(schedule.outStandingBalance)}
                      </td>
                    </>
                  )}
                  <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
                    <span
                      className={`p-1 rounded ${
                        schedule.status === "not paid"
                          ? "bg-red-200"
                          : schedule.status === "arrears"
                          ? "bg-red-400"
                          : schedule.status === "default"
                          ? "bg-red-600 text-slate-100"
                          : "bg-green-200"
                      }`}
                    >
                      {toCapitalized(schedule.status)}
                    </span>
                  </td>
                  {activeTab === 2 && (
                    <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
                      <button
                        className="btn btn-sm px-5 glass  bg-violet-500 text-slate-100"
                        onClick={() => setModalOpen(true)}
                      >
                        Pay
                      </button>
                    </td>
                  )}
                </tr>
                {activeTab === 2 && (
                  <Modal
                    setModalOpen={setModalOpen}
                    modalOpen={modalOpen}
                    onClose={() => setAmount(undefined)}
                  >
                    <section className="p-3 w-full">
                      <div className="w-full h-full flex flex-col gap-5  bg-white rounded-md p-2">
                        <h1 className="uppercase font-mono font-semibold text-xl">
                          Check Out Details
                        </h1>
                        <p className="font-semibold font-sans text-sm text-gray-700 p-2">
                          Client Name:{" "}
                          <span className="text-gray-500 font-bold">
                            {loan.client.first_name} {loan.client.last_name}
                          </span>{" "}
                        </p>
                        <p className="font-semibold font-sans text-sm text-gray-700 p-2">
                          Amount to Pay:{" "}
                          <span className="text-gray-500 font-bold">
                            {formatCurrency(schedule.outStandingBalance)}
                          </span>
                        </p>
                        <p className="font-semibold font-sans text-sm text-gray-700 p-2">
                          Payment Date:{" "}
                          <span className="text-gray-500 font-bold">
                            {formatDate(schedule.nextPayment)}
                          </span>
                        </p>
                        <p className="font-semibold font-sans text-sm text-gray-700 p-2">
                          Week:{" "}
                          <span className="text-gray-500 font-bold">
                            {schedule.week}
                          </span>
                        </p>
                        <input
                          autoFocus
                          type="number"
                          name=""
                          id=""
                          placeholder="Enter Amount to Pay"
                          className="block text-sm font-sans w-full px-4 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={amount}
                          onChange={(e) => setAmount(parseInt(e.target.value))}
                        />
                        <button
                          className="btn btn-sm disabled:bg-gray-300 glass bg-violet-500 text-slate-100 flex items-center justify-center gap-3"
                          disabled={isNaN(amount ?? 0) || (amount ?? 0) <= 0}
                          onClick={() =>{

                            handleArrearsPayment(
                              Number(amount),
                              loan.systemId,
                              loan.client.systemId,
                              schedule.nextPayment
                            )
                          }
                          }
                        >
                          Proceed{" "}
                          <IoIosArrowRoundForward
                            size={25}
                            className="relative icon-move-left"
                          />
                        </button>
                      </div>
                    </section>
                  </Modal>
                )}
              </React.Fragment>
            ))}
            <tr className="border">
              <td
                colSpan={2}
                className="font-semibold font-sans text-sm text-gray-900 p-2"
              >
                Total
              </td>
              <td className="font-semibold font-sans text-sm text-gray-900 p-2">
                {formatCurrency(totalPrincipalPayment)}
              </td>
              <td className="font-semibold font-sans text-sm text-gray-900 p-2">
                {formatCurrency(totalInterestPayment)}
              </td>
              <td className="font-semibold font-sans text-sm text-gray-900 p-2">
                {formatCurrency(totalPayment)}
              </td>
              <td className="p-2">....</td>
              {/* Empty cell for consistent layout */}
            </tr>
          </tbody>
        </table>
      </main>
    </>
  );
};

export default PaymentSchedule;



export function OutstandingDetails({data}: {data: any[]}){
  return (
    <main>
       <table className={`table overflow-x-auto`}>
          <thead>
            <tr className="bg-violet-200">
              <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
                Amount Disbursed
              </th>
              <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
               Total Principal Payment
              </th>
              <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
                Total Interest Payment
              </th>
              <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
                Total Repayment
              </th>
              <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
                Total Amount Paid 
              </th>
              <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
              Total Amount Left
              </th>
             
            </tr>
          </thead>
          <Outstanding data={data} page="loan-details"/>
          </table>
    </main>
    )
}