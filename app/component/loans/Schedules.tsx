import {
  formatCurrency,
  formatDate,
  toCapitalized,
} from "@/app/lib/helperFunctions";
import React from "react";
import ArrearsPaymentModal from "./ArrearsPaymentModal";
import DataRow from "../DataRow";
import FillEmptySpaces from "../FillEmptySpaces";
interface PaymentScheduleHeader {
  activeTab: number;
}
export const PaymentScheduleHeader: React.FC<PaymentScheduleHeader> = ({
  activeTab,
}) => (
  <tr className="bg-violet-800">
    <th className="text-sm font-sans font-medium text-slate-50 p-2 border text-left">
      Week
    </th>
    <th className="text-sm font-sans font-medium text-slate-50 p-2 border text-left">
      {activeTab === 1
        ? "Next Payment Date"
        : activeTab === 2
        ? "Due Date"
        : ""}
    </th>

    {activeTab === 1 && (
      <th className="text-sm font-sans font-medium text-slate-50 p-2 border text-left">
        Payment Date
      </th>
    )}

    <th className="text-sm font-sans font-medium text-slate-50 p-2 border text-left">
      Principal
    </th>
    <th className="text-sm font-sans font-medium text-slate-50 p-2 border text-left">
      Interest
    </th>
    <th className="text-sm font-sans font-medium text-slate-50 p-2 border text-left">
      Total
    </th>
    {activeTab === 2 && (
      <>
        <th className="text-sm font-sans font-medium text-slate-50 p-2 border text-left">
          Amount Paid
        </th>
        <th className="text-sm font-sans font-medium text-slate-50 p-2 border text-left">
          Amount Left
        </th>
      </>
    )}
    <th className="text-sm font-sans font-medium text-slate-50 p-2 border text-left">
      Payment Status
    </th>
    {activeTab === 2 && (
      <th className="text-sm font-sans font-medium text-slate-50 p-2 border text-left">
        Action
      </th>
    )}
  </tr>
);

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

export const PaymentScheduleRow: React.FC<PaymentScheduleRowProps> = ({
  schedule,
  index,
  activeTab,
  loan,
  modalOpen,
  setModalOpen,
  handleArrearsPayment,
  selectedSchedule,
  handleOnClickSchedule,
}) => {
  const [amount, setAmount] = React.useState<number | undefined>();

  return (
    <>
      <tr key={index}>
        <td className="text-sm font-sans text-gray-700 p-2 border">
          Week {schedule.week}
        </td>
        <td className="text-sm font-sans text-gray-700 p-2 border">
          {formatDate(schedule.nextPayment)}
        </td>
        {activeTab === 1 && (
          <td>
            {schedule.status === "paid" && schedule.datePaid
              ? formatDate(schedule.datePaid)
              : schedule.status === "paid" && !schedule.datePaid
              ? "N/A"
              : "Not Yet"}
          </td>
        )}
        <td className="text-sm font-sans text-gray-700 p-2 border">
          {formatCurrency(schedule.principalPayment)}
        </td>
        <td className="text-sm font-sans text-gray-700 p-2 border">
          {formatCurrency(schedule.interestPayment)}
        </td>
        <td className="text-sm font-sans text-gray-700 p-2 border">
          {formatCurrency(schedule.amountToPay)}
        </td>

        {activeTab === 2 && (
          <>
            <td className="text-sm font-sans text-gray-700 p-2 border">
              {formatCurrency(schedule.amountPaid)}
            </td>
            <td className="text-sm font-sans text-gray-700 p-2 border">
              {formatCurrency(schedule.outStandingBalance)}
            </td>
          </>
        )}

        <td className="text-sm font-sans text-gray-700 p-2 border">
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
          <td className="text-sm font-sans text-gray-700 p-2 border">
            <button
              className="btn btn-sm px-5 glass bg-violet-500 text-slate-100"
              onClick={() => {
                handleOnClickSchedule(schedule);
                setModalOpen(true);
              }}
            >
              Pay
            </button>
          </td>
        )}
      </tr>

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
    </>
  );
};

interface Props {
  totalPrincipal: number;
  totalInterest: number;
  totalPayment: number;
  activeTab: number;
}

const PaymentScheduleFooter: React.FC<Props> = ({
  totalPrincipal,
  totalInterest,
  totalPayment,
  activeTab,
}: any) => (
<>
{/* {activeTab === 1 && <td></td>} */}
<DataRow
  values={[
    formatCurrency(totalPrincipal),
    formatCurrency(totalInterest),
    formatCurrency(totalPayment),
  ]}
  label="Total"
  FillEmptySpaces={<FillEmptySpaces length={activeTab === 1 ? 2 : 1} />}
/>

</>
);

export default PaymentScheduleFooter;
