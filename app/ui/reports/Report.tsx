"use client";
import { processReport } from "@/app/actions/reportAuth";
import { LoadingDivs } from "@/app/api/Loaders/Loading";
import { Label } from "@/app/lib/MyFormInput/FormTemplates";
// import html2pdf from "html2pdf.js"
import React, { useEffect, useState, useRef } from "react";
import {
  Arrears,
  Default,
  Disbursement,
  GeneralReport,
  Outstanding,
  Repayments,
} from "@/app/component/report/Report";
import { useActionState } from "react";

import ReportTemplate from "@/app/component/report/ReportTemplate";
import { TransactionReportTableHeader } from "@/app/component/report/Report";
import { useGenerateDocument } from "@/app/lib/customHooks";
import GenerateDocumentButtons from "@/app/component/report/GenerateDocumentButtons";
import ReportGenerationForm from "@/app/component/report/ReportGenerationForm";


const Report = () => {

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [state, action, pending] = useActionState(processReport, undefined);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState(false);

  function toggleFilter(filter: string): void {
    if (selectedFilters.includes(filter))
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    else setSelectedFilters([...selectedFilters, filter]);
  }

  const reportGenerationRef = useRef<HTMLDivElement>(null!);
  // useEffect(() => {
  //   if (state?.response) {
  //     console.log(state.response.data);
  //   }
  // }, [state?.response]);

  const generatePDF = async () => {
    useGenerateDocument(reportGenerationRef, "pdf", setLoading);
  };

  function generateCSV(): void {
    useGenerateDocument(reportGenerationRef, "excel", setLoading);
  }

  return (
    <>
      <main className="max-w-full p-2">
        {!pending ? (
          <ReportGenerationForm
            state={state}
            action={action}
            startDate={startDate}
            endDate={endDate}
            selectedFilters={selectedFilters}
            toggleFilter={toggleFilter}
            pending={pending}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
          />
        ) : (
          <LoadingDivs />
        )}
        {/* {pending && <LoadingDivs />} */}

        <>
          <ReportTemplate startDate={startDate} endDate={endDate}>
            <div className="mb-10" ref={reportGenerationRef} id="report">
              {state?.response.data && (
                <GenerateDocumentButtons
                  generateCSV={generateCSV}
                  generatePdf={generatePDF}
                  pending={loading}
                />
              )}
              {state?.response.data?.disbursement?.length > 0 && (
                <TransactionReportTableHeader
                  reportType="disbursement"
                  reportHeading="Disbursement Reports"
                >
                  <Disbursement
                    disbursements={state?.response.data.disbursement}
                  />
                </TransactionReportTableHeader>
              )}
              {state?.response.data.report &&
                Object.keys(state.response.data.report).length > 0 && (
                  <GeneralReport reports={state.response.data.report} />
                )}

              {state?.response.data?.repayments && (
                <TransactionReportTableHeader
                  reportType="repayments"
                  reportHeading="Repayments Report"
                >
                  <Repayments
                    reports={state?.response.data.repayments[0].paymentSchedule}
                    totalAmountToPay={
                      state?.response.data.repayments[0].totalAmountToPay
                    }
                  />
                </TransactionReportTableHeader>
              )}
              {state?.response.data?.arrears && (
                <TransactionReportTableHeader
                  reportType="arrears"
                  reportHeading="Arrears Report"
                >
                  <Arrears
                    reports={state?.response.data.arrears[0].paymentSchedule}
                    totalAmountToPay={
                      state?.response.data.arrears[0].totalAmountToPay
                    }
                    totalAmountPaid={
                      state?.response.data.arrears[0].totalAmountPaid
                    }
                    totalOutstandingBalance={
                      state?.response.data.arrears[0].totalOutStandingBalance
                    }
                  />
                </TransactionReportTableHeader>
              )}
              {state?.response.data?.outstanding && (
                <TransactionReportTableHeader
                  reportType="outstanding"
                  reportHeading="Outstanding Balances Report"
                >
                  <Outstanding
                    data={state?.response.data.outstanding}
                    page="report"
                  />
                </TransactionReportTableHeader>
              )}
              {state?.response.data?.default && (
                <TransactionReportTableHeader
                  reportType="default"
                  reportHeading="Defaulters Report"
                >
                  <Default
                    reports={state?.response.data.default[0].paymentSchedule}
                    totalAmountLeft={
                      state?.response.data.default[0].grandTotalOutStanding
                    }
                    totalAmountPaid={
                      state?.response.data.default[0].totalAmountPaid
                    }
                    totalWeeklyAmount={
                      state?.response.data.default[0].totalAmountToPay
                    }
                  />
                </TransactionReportTableHeader>
              )}
              {state?.response.data?.payments && (
                <TransactionReportTableHeader
                  reportType="payments"
                  reportHeading="Payments Report"
                >
                  <Arrears
                    reports={state?.response.data.payments[0].paymentSchedule}
                    totalAmountToPay={
                      state?.response.data.payments[0].totalAmountToPay
                    }
                    totalAmountPaid={
                      state?.response.data.payments[0].totalAmountPaid
                    }
                    totalOutstandingBalance={
                      state?.response.data.payments[0].totalOutStandingBalance
                    }
                  />
                </TransactionReportTableHeader>
              )}
            </div>
          </ReportTemplate>
        </>
      </main>
    </>
  );
};

export default Report;
