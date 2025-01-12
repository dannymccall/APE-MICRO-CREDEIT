import { formatDate, toCapitalized } from "@/app/lib/utils";
import React from "react";

interface schedule {
  nextPayment: string;
  amountToPay: number;
  status: string;
  week: number;
  principalPayment: number;
  interestPayment: number;
}

interface IPaymentSchedule {
  schedules: schedule[];
  activeTab: number;
}
const PaymentSchedule: React.FC<IPaymentSchedule> = ({
  schedules,
  activeTab,
}) => {
  const totalPrincipalPayment = schedules.reduce((accum, curr) => {
    return accum + Number(curr.principalPayment);
  }, 0);

  const totalInterestPayment = schedules.reduce((accum, curr) => {
    return accum + Number(curr.interestPayment);
  }, 0);

  const totalPayment = totalPrincipalPayment + totalInterestPayment;

  console.log({ totalPrincipalPayment, totalInterestPayment, totalPayment });
  return (
    <table className="w-full">
      <thead>
        <tr className="bg-violet-200">
          <th className="text-base font-sans font-medium text-gray-700 p-2 border text-left">
            Week
          </th>
          <th className="text-base font-sans font-medium text-gray-700 p-2 border text-left">
            {activeTab === 1
              ? "Next Payment Date"
              : activeTab === 2
              ? "Due Date"
              : ""}
          </th>
          <th className="text-base font-sans font-medium text-gray-700 p-2 border text-left">
            Principal
          </th>
          <th className="text-base font-sans font-medium text-gray-700 p-2 border text-left">
            Interest
          </th>
          <th className="text-base font-sans font-medium text-gray-700 p-2 border text-left">
            Total
          </th>
          <th className="text-base font-sans font-medium text-gray-700 p-2 border text-left">
            Payment Status
          </th>
        </tr>
      </thead>
      <tbody>
        {schedules.map((schedule: schedule, index) => (
          <tr key={index}>
            <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
              Week {schedule.week}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
              {formatDate(schedule.nextPayment)}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
              GHS {Number(schedule.principalPayment || 0).toFixed(2)}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
              GHS {Number(schedule.interestPayment || 0).toFixed(2)}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
              GHS {Number(schedule.amountToPay || 0).toFixed(2)}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
              <span
                className={`p-1 rounded ${
                  schedule.status === "not paid" ? "bg-red-200" : "bg-green-200"
                }`}
              >
                {toCapitalized(schedule.status)}
              </span>
            </td>
          </tr>
        ))}
        <tr className="border">
          <td
            colSpan={2}
            className="font-semibold font-sans text-sm text-gray-900 p-2"
          >
            Total
          </td>
          <td className="font-semibold font-sans text-sm text-gray-900 p-2">
            GHS {totalPrincipalPayment.toFixed(2)}
          </td>
          <td className="font-semibold font-sans text-sm text-gray-900 p-2">
            GHS {totalInterestPayment.toFixed(2)}
          </td>
          <td className="font-semibold font-sans text-sm text-gray-900 p-2">
            GHS {totalPayment.toFixed(2)}
          </td>
          <td className="p-2">{"  "}</td>{" "}
          {/* Empty cell for consistent layout */}
        </tr>
      </tbody>
    </table>
  );
};

export default PaymentSchedule;
