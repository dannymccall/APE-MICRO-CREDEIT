"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { FaFileCsv } from "react-icons/fa6";
import PaymentSchedule from "../loans/PaymentSchedule";
import {
  formatDate,
  formatCurrency,
  getOutstandingBalances,
} from "@/app/lib/helperFunctions";

export function TransactionReportTableHeader({
  reportType,
  children,
  reportHeading,
  showTemporalDetails,
}: {
  reportType: string;
  children: ReactNode;
  reportHeading: string;
  showTemporalDetails?: boolean;
}) {
  return (
    <main className="overflow-x-auto">
      <h1 className="font-mono font-semibold text-lg m-5 underline text-center">
        {reportHeading}
      </h1>

      <table className="table-xs">
        <thead>
          <tr className="bg-violet-200">
            {/* Client Details */}
            {reportType === "repayments" && (
              <>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Week
                </th>
              </>
            )}
            {reportType === "arrears" && (
              <>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Week
                </th>
              </>
            )}
            {reportType === "default" && (
              <>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Week
                </th>
              </>
            )}
            {reportType === "payments" && (
              <>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Week
                </th>
              </>
            )}
            <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
              Client Full Name
            </th>
            <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
              Client Number
            </th>
            <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
              Product Name
            </th>
            <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
              Date of Disbursement
            </th>
            <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
              Maturity Date
            </th>
            {reportType === "disbursement" && (
              <>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Amount Disbursed
                </th>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Total Principal Payment
                </th>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Total Interest Payment
                </th>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Total Repayment
                </th>
              </>
            )}
            {reportType === "outstanding" && (
              <>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Amount Disbursed
                </th>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Total Principal Payment
                </th>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Total Interest Payment
                </th>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Total Repayment
                </th>
              </>
            )}

            {reportType === "outstanding" && (
              <>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Total Amount Paid
                </th>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Total Amount Left
                </th>
              </>
            )}
            {reportType === "default" && (
              <>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Total Amount Paid
                </th>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Total Amount Left
                </th>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Weekly Payment
                </th>
              </>
            )}

            <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
              Guarantor Name
            </th>
            <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
              Guarantor Number
            </th>
            <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
              Union Name
            </th>
            <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
              Union Location
            </th>
            {reportType === "repayments" && (
              <>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Weekly Payment
                </th>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Next Payment
                </th>
              </>
            )}
            {/* {reportType === "arrears" && (
              <>
              
              </>
            )} */}
            {/* {reportType === "default" && (
              <>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Weekly Payment
                </th>
              </>
            )} */}
            {reportType === "arrears" && (
              <>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Weekly Payment
                </th>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Amount Paid
                </th>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Out Standing Balance
                </th>
              </>
            )}

            {reportType === "payments" && (
              <>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Total Amount Paid
                </th>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Total Amount Left
                </th>
                <th className="text-sm font-sans font-medium text-gray-700 p-1 border text-left">
                  Weekly Payment
                </th>
              </>
            )}

            <td className="p-1">{"  "}</td>
          </tr>
        </thead>
        {children}
      </table>
    </main>
  );
}

export function Disbursement({ disbursements }: { disbursements: any[] }) {
  return (
    <tbody>
      {disbursements.map((disbursement, index) => (
        <tr key={index}>
          {/* Client Details */}
          <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
            {disbursement.client.first_name} {disbursement.client.last_name}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
            {disbursement.client.mobile}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
            {disbursement.loanProduct}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
            {formatDate(disbursement.expectedDisbursementDate)}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
            {formatDate(
              disbursement.paymentSchedule.schedule[
                disbursement.paymentSchedule.schedule.length - 1
              ].nextPayment
            )}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
            {formatCurrency(disbursement.principal)}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
            {formatCurrency(disbursement.principalPayment * 12)}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
            {formatCurrency(disbursement.interestPayment * 12)}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
            {formatCurrency(
              (disbursement.principalPayment + disbursement.interestPayment) *
                12
            )}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
            {disbursement.guarantor.guarantorFullName}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
            {disbursement.guarantor.mobile}
          </td>

          <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
            {disbursement.client.union}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
            {disbursement.client.unionLocation}
          </td>
        </tr>
      ))}
      <tr className="border">
        <td
          colSpan={5}
          className="font-semibold font-sans text-sm text-gray-900 p-1"
        >
          Total
        </td>
        <td className="font-semibold font-sans text-sm text-gray-900 p-1">
          {formatCurrency(
            disbursements.reduce((sum, loan) => sum + (loan.principal || 0), 0)
          )}
        </td>
        <td className="font-semibold font-sans text-sm text-gray-900 p-1">
          {formatCurrency(
            disbursements.reduce(
              (sum, loan) => sum + (loan.principalPayment || 0) * 12,
              0
            )
          )}
        </td>
        <td className="font-semibold font-sans text-sm text-gray-900 p-1">
          {formatCurrency(
            disbursements.reduce(
              (sum, loan) => sum + (loan.interestPayment || 0) * 12,
              0
            )
          )}
        </td>
        <td className="font-semibold font-sans text-sm text-gray-900 p-1">
          {formatCurrency(
            disbursements.reduce(
              (sum, loan) =>
                sum + (loan.interestPayment + loan.principalPayment || 0) * 12,
              0
            )
          )}
        </td>
        <td className="p-1">{"  "}</td> {/* Empty cell for consistent layout */}
      </tr>
    </tbody>
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
      <TransactionReportTableHeader
        reportType="disbursement"
        reportHeading="Disbursements"
      >
        <Disbursement disbursements={reports} />
      </TransactionReportTableHeader>
      <TransactionReportTableHeader
        reportType="repayments"
        reportHeading="Repayments"
      >
        <Repayments
          reports={repayments}
          totalAmountToPay={repaymentsSumValues.totalAmountToPay}
        />
      </TransactionReportTableHeader>
      <TransactionReportTableHeader
        reportType="outstanding"
        reportHeading="Outstanding Balances"
      >
        <Outstanding data={data} page="report" />
      </TransactionReportTableHeader>
      {arrears.length > 0 && (
        <TransactionReportTableHeader
          reportType="arrears"
          reportHeading="Arrears"
        >
          <Arrears
            reports={arrears}
            totalAmountToPay={arrearsSumValues.totalAmountToPay}
            totalAmountPaid={arrearsSumValues.totalAmountPaid}
            totalOutstandingBalance={arrearsSumValues.totalOutstandingBalance}
          />
        </TransactionReportTableHeader>
      )}
      {payments.length > 0 && (
        <TransactionReportTableHeader
          reportType="payments"
          reportHeading="Payments"
        >
          <Arrears
            reports={payments}
            totalAmountToPay={paymentSumValues.totalAmountToPay}
            totalAmountPaid={paymentSumValues.totalAmountPaid}
            totalOutstandingBalance={paymentSumValues.totalOutstandingBalance}
          />
        </TransactionReportTableHeader>
      )}

      {defaults.length > 0 && (
        <TransactionReportTableHeader
          reportType="default"
          reportHeading="Defaults"
        >
          <Default
            reports={defaults}
            totalAmountLeft={defaultSumValues.totalOutstandingBalance}
            totalAmountPaid={defaultSumValues.totalAmountPaid}
            totalWeeklyAmount={defaultSumValues.totalAmountToPay}
          />
        </TransactionReportTableHeader>
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
  return (
    <tbody>
      {reports &&
        reports.map((report, index) => (
          <tr key={index}>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              Week {report.schedules.week}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {report.clientDetails.first_name} {report.clientDetails.last_name}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {report.clientDetails.mobile}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {report.loanDetails.loanProduct}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {formatDate(report.loanDetails.expectedDisbursementDate)}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {formatDate(report.loanDetails.maturityDate)}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {report.guarantorDetails.guarantorFullName}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {report.guarantorDetails.mobile}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {report.clientDetails.union}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {report.clientDetails.unionLocation}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {formatCurrency(report.schedules.amountToPay)}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {formatDate(report.schedules.nextPayment)}
            </td>
          </tr>
        ))}
      <tr className="border">
        <td
          colSpan={10}
          className="font-semibold font-sans text-sm text-gray-900 p-1"
        >
          Total
        </td>
        <td className="font-semibold font-sans text-sm text-gray-900 p-1">
          {formatCurrency(totalAmountToPay)}
        </td>
        <td className="p-1">.....</td> {/* Empty cell for consistent layout */}
      </tr>
    </tbody>
  );
}
export function Arrears({
  reports,
  totalAmountToPay,
  totalAmountPaid,
  totalOutstandingBalance,
}: {
  reports: any[];
  totalAmountToPay: number;
  totalAmountPaid: number;
  totalOutstandingBalance: number;
}) {
  return (
    <tbody>
      {reports &&
        reports.map((report, index) => (
          <tr key={index}>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              Week {report.schedules.week}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {report.clientDetails.first_name} {report.clientDetails.last_name}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {report.clientDetails.mobile}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {report.loanDetails.loanProduct}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {formatDate(report.loanDetails.expectedDisbursementDate)}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {formatDate(report.loanDetails.maturityDate)}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {report.guarantorDetails.guarantorFullName}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {report.guarantorDetails.mobile}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {report.clientDetails.union}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {report.clientDetails.unionLocation}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {formatCurrency(report.schedules.amountToPay)}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {formatCurrency(report.schedules.outStandingBalance)}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {formatCurrency(report.schedules.amountPaid)}
            </td>
          </tr>
        ))}
      <tr className="border">
        <td
          colSpan={10}
          className="font-semibold font-sans text-sm text-gray-900 p-1"
        >
          Total
        </td>
        <td className="font-semibold font-sans text-sm text-gray-900 p-1">
          {formatCurrency(totalAmountToPay)}
        </td>
        <td className="font-semibold font-sans text-sm text-gray-900 p-1">
          {formatCurrency(totalOutstandingBalance)}
        </td>
        <td className="font-semibold font-sans text-sm text-gray-900 p-1">
          {formatCurrency(totalAmountPaid)}
        </td>
        <td className="p-1">....</td> {/* Empty cell for consistent layout */}
      </tr>
    </tbody>
  );
}

export function Default({
  reports,
  totalAmountPaid,
  totalAmountLeft,
  totalWeeklyAmount,
}: {
  reports: any[];
  totalAmountPaid: number;
  totalAmountLeft: number;
  totalWeeklyAmount: number;
}) {
  return (
    <tbody>
      {reports.length > 0 ? (
        reports.map((report, index) => (
          <tr key={index}>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              Week {report.schedules.week}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {report.clientDetails.first_name} {report.clientDetails.last_name}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {report.clientDetails.mobile}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {report.loanDetails.loanProduct}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {formatDate(report.loanDetails.expectedDisbursementDate)}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {formatDate(report.loanDetails.maturityDate)}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {formatCurrency(report.schedules.amountPaid)}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {formatCurrency(report.schedules.amountToPay)}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {formatCurrency(report.schedules.outStandingBalance)}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {report.guarantorDetails.guarantorFullName}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {report.guarantorDetails.mobile}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {report.clientDetails.union}
            </td>
            <td className="text-sm font-sans font-normal text-gray-700 p-1 border">
              {report.clientDetails.unionLocation}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={2}>
            <h1>No Report available for Arrears</h1>
          </td>
        </tr>
      )}
      <tr className="border">
        <td
          colSpan={6}
          className="font-semibold font-sans text-sm text-gray-900 p-1"
        >
          Total
        </td>
        <td className="font-semibold font-sans text-sm text-gray-900 p-1">
          {formatCurrency(totalAmountPaid)}
        </td>
        <td className="font-semibold font-sans text-sm text-gray-900 p-1">
          {formatCurrency(totalAmountLeft)}
        </td>
        <td className="font-semibold font-sans text-sm text-gray-900 p-1">
          {formatCurrency(totalWeeklyAmount)}
        </td>
        <td className="p-1">....</td> {/* Empty cell for consistent layout */}
      </tr>
    </tbody>
  );
}

export function Outstanding({ data, page }: { data: any[]; page: string }) {
  return (
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
            {formatCurrency(loan.totalAmountLeft)}
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
      <tr className="border">
        <td
          colSpan={page === "report" ? 5 : 0}
          className="font-semibold font-sans text-sm text-gray-900 p-1"
        >
          Total
        </td>
        <td className="font-semibold font-sans text-sm text-gray-900 p-1">
          {formatCurrency(data.reduce((sum, acc) => acc.totalPrincipal, 0))}
        </td>
        <td className="font-semibold font-sans text-sm text-gray-900 p-1">
          {formatCurrency(data.reduce((sum, acc) => acc.totalWeeklyAmount, 0))}
        </td>
        <td className="font-semibold font-sans text-sm text-gray-900 p-1">
          {formatCurrency(data.reduce((sum, acc) => acc.totalInterest, 0))}
        </td>
        <td className="font-semibold font-sans text-sm text-gray-900 p-1">
          {formatCurrency(
            data.reduce((sum, acc) => acc.totalOutstandingBalance, 0)
          )}
        </td>
        <td className="font-semibold font-sans text-sm text-gray-900 p-1">
          {formatCurrency(data.reduce((sum, acc) => acc.totalAmountPaid, 0))}
        </td>
        <td className="font-semibold font-sans text-sm text-gray-900 p-1">
          {formatCurrency(data.reduce((sum, acc) => acc.totalAmountLeft, 0))}
        </td>
        <td className="p-1">....</td> {/* Empty cell for consistent layout */}
      </tr>
    </tbody>
  );
}
