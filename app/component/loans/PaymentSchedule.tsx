"use client";

import { formatCurrency } from "@/app/lib/helperFunctions";
import React, { useState } from "react";

import TableBody from "../TableBody";
import TableHeader, { TableColumn } from "../TableHeader";
import PaymentScheduleFooter, {
  PaymentScheduleHeader,
  PaymentScheduleRow,
  Schedule,
} from "./Schedules";
import ScheduleCard from "../ScheduleCard";

interface schedule {
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

interface IPaymentSchedule {
  schedules: schedule[];
  activeTab: number;
  size?: string;
  loan?: any;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  setModalOpen,
}) => {
  // const [selectedSchedule, setSelectedSchedule] = useState<any>();
  const totalPrincipalPayment = schedules.reduce(
    (acc: number, curr: schedule) => acc + Number(curr.principalPayment),
    0
  );

  const totalInterestPayment = schedules.reduce(
    (acc: number, curr: schedule) => acc + Number(curr.interestPayment),
    0
  );
  const totalPayment = totalPrincipalPayment + totalInterestPayment;

  const [selectedSchedule, setSelectedSchedule] = useState<Schedule>();

  // useEffect(() => {
  //   console.log(selectedLoan, selectedSchedule)
  // },[])

  const handleOnClickSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
  };

  return (
    <main className="w-full">
    
      <table className="table">
        <thead>
          <PaymentScheduleHeader activeTab={activeTab} />
        </thead>
        <tbody>
          {schedules.map((schedule, index) => (
            <PaymentScheduleRow
              key={index}
              schedule={schedule}
              index={index}
              activeTab={activeTab}
              loan={loan}
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              handleArrearsPayment={handleArrearsPayment}
              selectedSchedule={selectedSchedule!}
              handleOnClickSchedule={handleOnClickSchedule}
            />
              ))}
          <PaymentScheduleFooter
            totalPrincipal={totalPrincipalPayment}
            totalInterest={totalInterestPayment}
            totalPayment={totalPayment}
            activeTab={activeTab}
          />
        </tbody>
      </table>
       {/* <div className="grid phone:grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 gap-4">
            {schedules.map((schedule, index) => (
              <ScheduleCard
                schedule={schedule}
                key={index}
                index={index}
                activeTab={activeTab}
                loan={loan}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                handleArrearsPayment={handleArrearsPayment}
                selectedSchedule={selectedSchedule!}
                handleOnClickSchedule={handleOnClickSchedule}
              />
            ))}
            </div> */}
    </main>
  );
};

export default PaymentSchedule;

export function OutstandingDetails({ data }: { data: any[] }) {
  console.log("outstanding balances: ", data);
  const columns: TableColumn[] = [
    {
      key: "amount_disbursed",
      label: "Amount Disbursed",
      align: "right",
    },
    {
      key: "total_principal_payment",
      label: "Total Principal Payment",
      align: "right",
    },
    {
      key: "total_interest_payment",
      label: "Total Interest Payment",
      align: "right",
    },
    {
      key: "total_repayment",
      label: "Total Repayment",
      align: "right",
    },
    {
      key: "total_amount_paid",
      label: "Total Amount Paid",
      align: "right",
    },
    {
      key: "total_outstanding_balance",
      label: "Total Outstanding Balance",
      align: "right",
    },
  ];

  const rows = [
    {
      header: "Total Principal",
      accessor: (d: any) => formatCurrency(d.totalPrincipal),
    },
    {
      header: "Total Weekly Amount",
      accessor: (d: any) => formatCurrency(d.totalWeeklyAmount),
    },
    {
      header: "Total Interest",
      accessor: (d: any) => formatCurrency(d.totalInterest),
    },
    {
      header: "Total Outstanding Balance",
      accessor: (d: any) => formatCurrency(d.totalOutstandingBalance),
    },
    {
      header: "Total Amount Paid",
      accessor: (d: any) => formatCurrency(d.totalAmountPaid),
    },
    {
      header: "Balance Remaining",
      accessor: (d: any) =>
        formatCurrency(d.totalOutstandingBalance - d.totalAmountPaid),
    },
  ];

  return (
    <main>
      <table className={`table overflow-x-auto`}>
        <TableHeader columns={columns} />
        <TableBody columns={rows} data={data} />
      </table>
    </main>
  );
}
