"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { FaFileCsv } from "react-icons/fa6";
import PaymentSchedule from "../loans/PaymentSchedule";
import {
  formatDate,
  formatCurrency,
  getOutstandingBalances,
} from "@/app/lib/helperFunctions";
import FillEmptySpaces from "../FillEmptySpaces";
import DataRow from "../DataRow";
import TableHeader, { TableColumn } from "../TableHeader";
import TableBody from "../TableBody";

export function Disbursement({
  disbursements,
  header,
}: {
  disbursements: any[];
  header: string;
}) {
  const totalPrincipal = disbursements.reduce(
    (sum, loan) => sum + (loan.principal || 0),
    0
  );
  const totalPrincipalPayment = disbursements.reduce(
    (sum, loan) => sum + Math.floor((loan.principalPayment || 0) * 12),
    0
  );
  const interestPayment = disbursements.reduce(
    (sum, loan) => sum + (loan.interestPayment || 0) * 12,
    0
  );
  const totalPayment = disbursements.reduce(
    (sum, loan) =>
      sum + (loan.interestPayment + loan.principalPayment || 0) * 12,
    0
  );

  const columns: TableColumn[] = [
    { key: " client_full_name", label: "Client Full Name", sortable: false },
    { key: "client_number", label: "Client Number", sortable: false },
    { key: "product_name", label: "Product Name" },
    {
      key: "date_of_disbursement",
      label: "Date of Disbursement",
      sortable: false,
    },
    { key: "maturity_date", label: "Maturity Date", align: "right" },
    { key: "amount_disbursed", label: "Amount Disbursed", align: "right" },
    {
      key: "total_principal_payment",
      label: "Total Principal Payment",
      align: "right",
    },
    { key: "total_interest_payment", label: "Total Interest Payment", align: "right" },
    { key: "total_repayment", label: " Total Repayment", align: "right" },
    { key: "guarantor_name", label: "Guarantor Name", align: "right" },
    { key: "guarantor_number", label: "Guarantor Number", align: "right" },
    { key: "union_name", label: "Union Name", align: "right" },
    { key: "union_location", label: "Union Location", align: "right" },
  ];

  const rows = [
    {
      header: "Client Name",
      accessor: (d: any) => `${d.client.first_name} ${d.client.last_name}`,
    },
    {
      header: "Mobile",
      accessor: (d: any) => d.client.mobile,
    },
    {
      header: "Loan Product",
      accessor: (d: any) => d.loanProduct,
    },
    {
      header: "Disbursement Date",
      accessor: (d: any) => formatDate(d.expectedDisbursementDate),
    },
    {
      header: "Last Payment Date",
      accessor: (d: any) =>
        formatDate(
          d.paymentSchedule.schedule[d.paymentSchedule.schedule.length - 1]
            .nextPayment
        ),
    },
    {
      header: "Principal",
      accessor: (d: any) => formatCurrency(Math.floor(d.principal)),
    },
    {
      header: "Monthly Principal (x12)",
      accessor: (d: any) => formatCurrency(Math.floor(d.principalPayment * 12)),
    },
    {
      header: "Monthly Interest (x12)",
      accessor: (d: any) => formatCurrency(Math.floor(d.interestPayment * 12)),
    },
    {
      header: "Total (x12)",
      accessor: (d: any) =>
        formatCurrency(Math.floor(d.principalPayment +  d.interestPayment) * 12),
    },
    {
      header: "Guarantor Name",
      accessor: (d: any) => d.guarantor.guarantorFullName,
    },
    {
      header: "Guarantor Mobile",
      accessor: (d: any) => d.guarantor.mobile,
    },
    {
      header: "Union",
      accessor: (d: any) => d.client.union,
    },
    {
      header: "Union Location",
      accessor: (d: any) => d.client.unionLocation,
    },
  ];
  return (
    <main className="overflow-x-auto">
      <h1 className="font-mono font-semibold text-lg m-5 underline text-center">
        {header}
      </h1>
      <table className="table-xs">
        <TableHeader columns={columns} />
        <TableBody
          columns={rows}
          data={disbursements}
          footerRow={
            <>
              <DataRow
                label="Total"
                className="text-neutral-800"
                values={[
                  formatCurrency(totalPrincipal),
                  formatCurrency(totalPrincipalPayment),
                  formatCurrency(interestPayment),
                  formatCurrency(totalPayment),
                ]}
                FillEmptySpaces={<FillEmptySpaces length={4} />}
              />
              {/* <td className="p-1">{"  "}</td>{" "} */}
            </>
          }
        />
      </table>
    </main>
  );
}

export function GeneralReport({ reports }: { reports: any[] }) {
  let paymentSchedule: Array<Record<string, any>> = [];
  interface Schedule {
    week: number;
    amountToPay: number;
    nextPayment: string;
    amountPaid?: number;
    outStandingBalance?: number;
    status?: string;
  }

  interface ClientDetails {
    first_name: string;
    last_name: string;
    mobile: string;
    union: string;
    unionLocation: string;
  }

  interface LoanDetails {
    loanProduct: string;
    principal: number;
    expectedDisbursementDate: string;
    maturityDate: string;
  }

  interface GuarantorDetails {
    guarantorFullName: string;
    mobile: string;
  }

  interface Report {
    client: ClientDetails;
    loanProduct: string;
    principal: number;
    expectedDisbursementDate: string;
    maturityDate: string;
    guarantor: GuarantorDetails;
    paymentSchedule: {
      schedule: Schedule[];
    };
  }

  reports.forEach((report: Report) => {
    report.paymentSchedule.schedule.forEach((schedule: Schedule) => {
      paymentSchedule.push({
        schedules: schedule,
        clientDetails: report.client,
        loanDetails: {
          loanProduct: report.loanProduct,
          principal: report.principal,
          expectedDisbursementDate: report.expectedDisbursementDate,
          maturityDate: report.maturityDate,
        },
        guarantorDetails: report.guarantor,
      });
    });
  });

  const data: any = getOutstandingBalances(reports);

  const getPaymentSchedule = (data: any[], status: string): any[] =>
    data.filter((schedule) => schedule.schedules.status === status);
  const getSumValues = (
    data: any
  ): {
    totalAmountToPay: number;
    totalAmountPaid: number;
    totalOutstandingBalance: number;
  } => {
    console.log(data);
    const totalAmountToPay: number = data.reduce(
      (sum: number, accum: { schedules: { amountToPay: number } }) =>
        sum + accum.schedules.amountToPay,
      0
    );
    const totalAmountPaid: number = data.reduce(
      (sum: number, accum: { schedules: { amountPaid: number } }) =>
        sum + accum.schedules.amountPaid,
      0
    );
    const totalOutstandingBalance: number = data.reduce(
      (sum: number, accum: { schedules: { outStandingBalance: number } }) =>
        sum + accum.schedules.outStandingBalance,
      0
    );

    return { totalAmountToPay, totalAmountPaid, totalOutstandingBalance };
  };

  const repayments = getPaymentSchedule(paymentSchedule, "not paid");
  const repaymentsSumValues: { totalAmountToPay: number } =
    getSumValues(repayments);

  const arrears: any[] = getPaymentSchedule(paymentSchedule, "arrears");
  console.log({ arrears });
  const arrearsSumValues: {
    totalAmountToPay: number;
    totalAmountPaid: number;
    totalOutstandingBalance: number;
  } = getSumValues(arrears);

  const payments: any[] = getPaymentSchedule(paymentSchedule, "paid");
  const paymentSumValues: {
    totalAmountToPay: number;
    totalAmountPaid: number;
    totalOutstandingBalance: number;
  } = getSumValues(payments);

  const defaults: any[] = getPaymentSchedule(paymentSchedule, "default");
  const defaultSumValues: {
    totalAmountToPay: number;
    totalAmountPaid: number;
    totalOutstandingBalance: number;
  } = getSumValues(defaults);

  return (
    <React.Fragment>
      <h1 className="font-mono font-semibold text-lg text-center m-5 underline">
        General Report
      </h1>

      <Disbursement disbursements={reports} header="Disbursement" />
      <Disbursement disbursements={reports} header="Matured Loans Report" />
      <Repayments
        reports={repayments}
        totalAmountToPay={repaymentsSumValues.totalAmountToPay}
      />

      <Outstanding data={data} page="report" />
      {arrears.length > 0 && (
        <Arrears
          reports={arrears}
          totalAmountToPay={arrearsSumValues.totalAmountToPay}
          totalAmountPaid={arrearsSumValues.totalAmountPaid}
          totalOutstandingBalance={arrearsSumValues.totalOutstandingBalance}
          header="Arrears Report"
        />
      )}
      {payments.length > 0 && (
        <Arrears
          reports={payments}
          totalAmountToPay={paymentSumValues.totalAmountToPay}
          totalAmountPaid={paymentSumValues.totalAmountPaid}
          totalOutstandingBalance={paymentSumValues.totalOutstandingBalance}
          header="Payments Report"
        />
      )}

      {defaults.length > 0 && (
          <Arrears
          reports={payments}
          totalAmountToPay={paymentSumValues.totalAmountToPay}
          totalAmountPaid={paymentSumValues.totalAmountPaid}
          totalOutstandingBalance={paymentSumValues.totalOutstandingBalance}
          header="Arrears Report"
        />
      )}
    </React.Fragment>
  );
}
export function Repayments({
  reports,
  totalAmountToPay,
}: {
  reports: any[];
  totalAmountToPay: number;
}) {
  const columns: TableColumn[] = [
    { key: "week", label: "Week", sortable: false },
    { key: "client_full_name", label: "Client Full Name", sortable: false },
    { key: "client_number", label: "Client Number" },
    {
      key: "product_name",
      label: "Product Name",
      sortable: false,
    },
    {
      key: "maturity_date",
      label: "Maturity Date",
      align: "right",
    },
    {
      key: "date_of_disbursement",
      label: "Date of Disbursement",
      align: "right",
    },
    { key: "guarantor_name", label: "Guarantor Name", align: "right" },
    { key: "guarantor_number", label: "Guarantor Number", align: "right" },
    { key: "union_name", label: "Union Name", align: "right" },
    { key: "union_location", label: "Union Location", align: "right" },
    { key: "weekly_payment", label: "Weekly Payment", align: "right" },
    { key: "next_payment", label: "Next Payment", align: "right" },
  ];

  const rows = [
    {
      header: "Client Name",
      accessor: (d: any) => `${d.schedules.week}`,
    },
    {
      header: "Mobile",
      accessor: (d: any) =>
        `${d.clientDetails.first_name} ${d.clientDetails.last_name}`,
    },
    {
      header: "Loan Product",
      accessor: (d: any) => d.clientDetails.mobile,
    },
    {
      header: "Loan Product",
      accessor: (d: any) => d.loanDetails.loanProduct,
    },
    {
      header: "Monthly Principal (x12)",
      accessor: (d: any) => formatDate(d.loanDetails.maturityDate),
    },
    {
      header: "Principal",
      accessor: (d: any) => formatDate(d.loanDetails.expectedDisbursementDate),
    },
    {
      header: "Monthly Interest (x12)",
      accessor: (d: any) => d.guarantorDetails.guarantorFullName,
    },
    {
      header: "Total (x12)",
      accessor: (d: any) => d.guarantorDetails.mobile,
    },
   
   
    {
      header: "Union",
      accessor: (d: any) => d.clientDetails.union,
    },
    {
      header: "Union Location",
      accessor: (d: any) => d.clientDetails.unionLocation,
    },
    {
      header: "Union Location",
      accessor: (d: any) => formatCurrency(d.schedules.amountToPay),
    },
    {
      header: "Union Location",
      accessor: (d: any) => formatDate(d.schedules.nextPayment),
    },
  ];
  return (
    <main className="overflow-x-auto">
      <h1 className="font-mono font-semibold text-lg m-5 underline text-center">
        Repayment Reports
      </h1>
      <table className="table-xs">
        <TableHeader columns={columns} />
        <TableBody
          columns={rows}
          data={reports}
          footerRow={
            <>
              <DataRow
                label="Total"
                className="text-neutral-800"
                values={[formatCurrency(totalAmountToPay)]}
                FillEmptySpaces={<FillEmptySpaces length={9} />}
              />
              {/* <td className="p-1">{"  "}</td>{" "} */}
            </>
          }
        />
      </table>
    </main>
  );
}
export function Arrears({
  reports,
  totalAmountToPay,
  totalAmountPaid,
  totalOutstandingBalance,
  header,
}: {
  reports: any[];
  totalAmountToPay: number;
  totalAmountPaid: number;
  totalOutstandingBalance: number;
  header: string;
}) {
  const columns: TableColumn[] = [
    { key: "week", label: "Week", sortable: false },
    { key: "client_full_name", label: "Client Full Name", sortable: false },
    { key: "client_number", label: "Client Number" },
    {
      key: "product_name",
      label: "Product Name",
      sortable: false,
    },
    {
      key: "date_of_disbursement",
      label: "Date of Disbursement",
      align: "right",
    },
    {
      key: "maturity_date",
      label: "Maturity Date",
      align: "right",
    },
    { key: "guarantor_name", label: "Guarantor Name", align: "right" },
    { key: "guarantor_number", label: "Guarantor Number", align: "right" },
    { key: "union_name", label: "Union Name", align: "right" },
    { key: "union_location", label: "Union Location", align: "right" },
    { key: "weekly_payment", label: "Weekly Payment", align: "right" },
    { key: "amount_paid", label: "Amount Paid", align: "right" },
    {
      key: "outstanding_balance",
      label: "Outstanding Balance",
      align: "right",
    },
  ];

  const rows = [
    {
      header: "Client Name",
      accessor: (d: any) => `${d.schedules.week}`,
    },
    {
      header: "Mobile",
      accessor: (d: any) =>
        `${d.clientDetails.first_name} ${d.clientDetails.last_name}`,
    },
    {
      header: "Loan Product",
      accessor: (d: any) => d.clientDetails.mobile,
    },
    {
      header: "Loan Product",
      accessor: (d: any) => d.loanDetails.loanProduct,
    },
    {
      header: "Principal",
      accessor: (d: any) => formatDate(d.loanDetails.expectedDisbursementDate),
    },
    {
      header: "Monthly Principal (x12)",
      accessor: (d: any) => formatDate(d.loanDetails.maturityDate),
    },
    {
      header: "Monthly Interest (x12)",
      accessor: (d: any) => d.guarantorDetails.guarantorFullName,
    },
    {
      header: "Total (x12)",
      accessor: (d: any) => d.guarantorDetails.mobile,
    },
   
   
    {
      header: "Union",
      accessor: (d: any) => d.clientDetails.union,
    },
    {
      header: "Union Location",
      accessor: (d: any) => d.clientDetails.unionLocation,
    },

    {
      header: "Union Location",
      accessor: (d: any) => formatCurrency(d.schedules.amountToPay),
    },
    {
      header: "Union Location",
      accessor: (d: any) => formatCurrency(d.schedules.amountPaid),
    },
    {
      header: "Union Location",
      accessor: (d: any) => formatCurrency(d.schedules.outStandingBalance),
    },
  ];
  return (
    <main className="overflow-x-auto">
      <h1 className="font-mono font-semibold text-lg m-5 underline text-center">
        {header}
      </h1>
      <table className="table-xs">
        <TableHeader columns={columns} />
         <TableBody
          columns={rows}
          data={reports}
          footerRow={
            <>
              <DataRow
                label="Total"
                className="text-neutral-800"
                values={[
              formatCurrency(totalAmountToPay),
              formatCurrency(totalAmountPaid),
              formatCurrency(totalOutstandingBalance),
            ]}
            FillEmptySpaces={<FillEmptySpaces length={9} />}
              />
              {/* <td className="p-1">{"  "}</td>{" "} */}
            </>
          }
        />
      </table>
    </main>
  );
}


export function Outstanding({ data, page }: { data: any[]; page: string }) {
  const totalPrincipal = formatCurrency(
    data.reduce((sum, acc) => sum + acc.totalPrincipal, 0)
  );
  const totalWeeklyAmount = formatCurrency(
    data.reduce((sum, acc) => sum + acc.totalWeeklyAmount, 0)
  );
  const totalInterest = formatCurrency(
    data.reduce((sum, acc) => sum + acc.totalInterest, 0)
  );
  const totalOutstandingBalance = formatCurrency(
    data.reduce((sum, acc) => sum + acc.totalOutstandingBalance, 0)
  );
  const totalAmountPaid = formatCurrency(
    data.reduce((sum, acc) => sum + acc.totalAmountPaid, 0)
  );
  const totalSum = formatCurrency(
    data.reduce(
      (sum, acc) => sum + (acc.totalOutstandingBalance - acc.totalAmountPaid),
      0
    )
  );

  const columns: TableColumn[] = [
    { key: "client_full_name", label: "Client Full Name", sortable: false },
    { key: "client_number", label: "Client Number" },
    {
      key: "product_name",
      label: "Product Name",
      sortable: false,
    },
    {
      key: "date_of_disbursement",
      label: "Date of Disbursement",
      align: "right",
    },
    {
      key: "maturity_date",
      label: "Maturity Date",
      align: "right",
    },
    { key: "amount_disbursed", label: "Amount Disbursed", align: "right" },
    {
      key: "total_principal_payment",
      label: "Payment Principal Payment",
      align: "right",
    },
    {
      key: "total_interest_payment",
      label: "Total Interest Payment",
      align: "right",
    },
    { key: "total_repayment", label: "Total Repayment", align: "right" },
    { key: "total_amount_paid", label: "Total Amount Paid", align: "right" },
    {
      key: "total_outstanding_Balance",
      label: "Total Outstanding Balance",
      align: "right",
    },
    { key: "guarantor_name", label: "Guarantor Name", align: "right" },
    { key: "guarantor_number", label: "Guarantor Number", align: "right" },
    { key: "union_name", label: "Union Name", align: "right" },
    { key: "union_location", label: "Union Location", align: "right" },
  ];
  return (
    <main className="overflow-x-auto">
      <h1 className="font-mono font-semibold text-lg m-5 underline text-center">
        Outstanding Reports
      </h1>
      <table className="table-xs">
        <TableHeader columns={columns} />
        <tbody>
          {data.map((loan) => (
            <tr key={loan.loanId.toString()}>
              {page === "report" && (
                <React.Fragment>
                  <td className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                    {loan.clientName}
                  </td>
                  <td className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                    {loan.clientMobile}
                  </td>
                  <td className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                    {loan.loanProduct}
                  </td>
                  <td className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                    {new Date(loan.loanDisbursementDate).toLocaleDateString()}
                  </td>
                  <td className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                    {new Date(loan.loanMaturityDate).toLocaleDateString()}
                  </td>
                </React.Fragment>
              )}

              <td className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                {formatCurrency(loan.totalPrincipal)}
              </td>
              <td className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                {formatCurrency(loan.totalWeeklyAmount)}
              </td>
              <td className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                {formatCurrency(loan.totalInterest)}
              </td>
              <td className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                {formatCurrency(loan.totalOutstandingBalance)}
              </td>
              <td className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                {formatCurrency(loan.totalAmountPaid)}
              </td>
              <td className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                {formatCurrency(
                  loan.totalOutstandingBalance - loan.totalAmountPaid
                )}
              </td>
              {page === "report" && (
                <React.Fragment>
                  <td className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                    {loan.guarantorName}
                  </td>
                  <td className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                    {loan.guarantorMobile}
                  </td>
                  <td className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                    {loan.clientUnion}
                  </td>
                  <td className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                    {loan.clientUnionLocation}
                  </td>
                </React.Fragment>
              )}
            </tr>
          ))}
          <DataRow
            label="Total"
            className="text-neutral-800"
            values={[
              totalPrincipal,
              totalWeeklyAmount,
              totalInterest,
              totalOutstandingBalance,
              totalAmountPaid,
              totalSum,
            ]}
            FillEmptySpaces={
              page === "report" ? <FillEmptySpaces length={4} /> : <h1></h1>
            }
          />
        </tbody>
      </table>
    </main>
  );
}
