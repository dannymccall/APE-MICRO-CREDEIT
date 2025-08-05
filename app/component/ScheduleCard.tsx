import React from "react";
import {
  formatCurrency,
  formatDate,
  toCapitalized,
} from "../lib/helperFunctions";
import ArrearsPaymentModal from "./loans/ArrearsPaymentModal";

export interface Schedule {
  nextPayment: string;
  amountToPay: number;
  status: string;
  week: number;
  principalPayment: number;
  interestPayment: number;
  outStandingBalance: number;
  amountPaid: number;
  datePaid: string;
}

export interface PaymentScheduleRowProps {
  schedule: Schedule;
  index: number;
  activeTab: number;
  loan: any;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSchedule: Schedule;
  handleOnClickSchedule: (selectedSchedule: Schedule) => void;
  handleArrearsPayment: (
    amount: number,
    loadId: string,
    nextPayment: string,
    clientId: string
  ) => void;
}
const ScheduleCard = ({
  schedule,
  index,
  activeTab,
  loan,
  modalOpen,
  setModalOpen,
  handleArrearsPayment,
  selectedSchedule,
  handleOnClickSchedule,
}: PaymentScheduleRowProps) => {
  const [amount, setAmount] = React.useState<number | undefined>();

  return (
    <div
      key={index}
      className="bg-white shadow rounded-xl p-4 border hover:shadow-lg transition flex flex-col gap-2"
    >
      <h3 className="font-bold text-purple-700">Week {schedule.week}</h3>
      <p className="text-sm text-gray-500">
        Next Payment: {formatDate(schedule.nextPayment)}
      </p>

      {activeTab === 1 && (
        <p className="text-sm text-gray-500">
          Payment Date:{" "}
          {schedule.status === "paid" && schedule.datePaid
            ? formatDate(schedule.datePaid)
            : schedule.status === "paid" && !schedule.datePaid
            ? "N/A"
            : "Not Yet"}
        </p>
      )}

      <p className="text-sm text-gray-700">
        Principal: {formatCurrency(schedule.principalPayment)}
      </p>
      <p className="text-sm text-gray-700">
        Interest: {formatCurrency(schedule.interestPayment)}
      </p>
      <p className="font-bold text-gray-800">
        Total: {formatCurrency(schedule.amountToPay)}
      </p>

      {activeTab === 2 && (
        <>
          <p className="text-sm text-gray-700">
            Amount Paid: {formatCurrency(schedule.amountPaid)}
          </p>
          <p className="text-sm text-gray-700">
            Amount in Arrears: {formatCurrency(schedule.outStandingBalance)}
          </p>
        </>
      )}

      <span
        className={`px-3 py-1 rounded text-xs font-bold w-fit ${
          schedule.status === "not paid"
            ? "bg-red-200 text-red-800"
            : schedule.status === "arrears"
            ? "bg-red-400 text-white"
            : schedule.status === "default"
            ? "bg-red-600 text-slate-100"
            : "bg-green-200 text-green-800"
        }`}
      >
        {toCapitalized(schedule.status)}
      </span>

      {activeTab === 2 && (
        <button
          className="btn btn-sm w-1/3 mt-2 px-5 bg-violet-500 text-slate-100 rounded hover:bg-violet-600"
          onClick={() => {
            handleOnClickSchedule(schedule);
            setModalOpen(true);
          }}
        >
          Pay
        </button>
      )}

      {activeTab === 2 && selectedSchedule && (
        <ArrearsPaymentModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          amount={amount!}
          setAmount={setAmount}
          loan={loan}
          handleArrearsPayment={handleArrearsPayment}
          selectedSchedule={selectedSchedule}
        />
      )}
    </div>
  );
};

export default ScheduleCard;
