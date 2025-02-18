"use client";
import { processReport } from "@/app/actions/reportAuth";
import { LoadingDivs } from "@/app/component/Loading";
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
import { FaFileCsv } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa";
import { GrDocumentCsv } from "react-icons/gr";
import ReportTemplate from "@/app/component/report/ReportTemplate";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { TransactionReportTableHeader } from "@/app/component/report/Report";
 import { useGenerateDocument } from "@/app/lib/customHooks";
const Report = () => {
  const availableFilters = [
    "disbursement",
    "repayments",
    "arrears",
    "outstanding",
    "default",
    "payments"
  ];
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [state, action, pending] = useActionState(processReport, undefined);
  const [startDate, setStateDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  function toggleRole(filter: string): void {
    if (selectedFilters.includes(filter))
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    else setSelectedFilters([...selectedFilters, filter]);
  }

  const reportGenerationRef = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    if (state?.response) {
      console.log(state.response.data);
    }
  }, [state?.response]);


  const generatePDF = async () => {
    useGenerateDocument(reportGenerationRef, "pdf", setLoading)
  };


  function generateCSV(): void {

    useGenerateDocument(reportGenerationRef, "excel", setLoading)
  }

  return (
    <>
      <main className="max-w-full p-2">
        {!pending ? (
          <div className=" flex flex-col bg-white m-4 p-5 gap-2 rounded-md">
            <h1 className="font-mono font-semibold text-lg">Generate Report</h1>
            <p className=" text-red-500 p-1 font-semibold text-sm">
              {state?.errors && state.response.message}
            </p>
            <form action={action}>
              <div className="w-full flex phone:flex-col desktop:flex-row laptop:flex-row tablet:flex-col gap-5">
                <div className="w-full flex flex-col justify-center ">
                  <Label
                    className="font-sans w-40 font-medium text-gray-500 phone:text-sm laptop:text-base desktop:text-base tablet:text-sm"
                    labelName="Start Date:"
                  />
                  <input
                    type="date"
                    className="block text-sm  w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    name="startDate"
                    value={startDate}
                    onChange={(e) => setStateDate(e.target.value)}
                  />
                  <p className=" text-red-500 p-1 font-semibold text-sm">
                    {state?.errors?.startDate && state.errors.startDate}
                  </p>
                </div>
                <div className="w-full flex flex-col justify-center">
                  <Label
                    className="font-sans w-40 font-medium text-gray-500 phone:text-sm laptop:text-base desktop:text-base tablet:text-sm"
                    labelName="End Date:"
                  />
                  <input
                    type="date"
                    className="block text-sm  w-full px-5 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    name="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <p className=" text-red-500 p-1 font-semibold text-sm">
                    {state?.errors?.startDate && state.errors.endDate}
                  </p>
                </div>

                <div className="w-full flex flex-col">
                  <Label
                    className="font-sans w-20 font-medium text-gray-500 phone:text-sm laptop:text-base desktop:text-base tablet:text-sm"
                    labelName="Filters:"
                  />
                  <div className="w-full flex gap-2 phone:flex-col desktop:flex-row laptop:flex-row tablet:flex-row flex-wrap">
                    {availableFilters.map((filter, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => toggleRole(filter)}
                        className={`btn btn-sm ${selectedFilters.includes(filter)
                            ? "bg-violet-600 text-white"
                            : "bg-white text-violet-600"
                          } flex flex-row justify-between  border-2 border-violet-600 m-1 px-2 py-1 rounded-md font-medium hover:bg-violet-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-opacity-50`}
                        disabled={pending}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
                <input type="hidden" name="filters" value={selectedFilters} />
              </div>
              <button
                type="submit"
                
                className="btn btn-md mt-5 bg-violet-500 text-slate-100"
              >
                Generate
              </button>
            </form>
          </div>
        ) : (
          <button className="btn mt-5 bg-violet-500 text-slate-100">
            Generate New Report
          </button>
        )}
        {pending && <LoadingDivs />}

        <>
          <ReportTemplate
            startDate={startDate}
            endDate={endDate}
            generatePdf={generatePDF}
            generateCSV={generateCSV}
            pending={loading}
          >
            <div className="mb-10" ref={reportGenerationRef} id="report" >
              {state?.response.data?.disbursement?.length > 0 && (
                <TransactionReportTableHeader reportType="disbursement" reportHeading="Disbursement Reports">
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
                <TransactionReportTableHeader reportType="repayments" reportHeading="Repayments Report">
                  <Repayments
                    reports={state?.response.data.repayments[0].paymentSchedule}
                    totalAmountToPay={
                      state?.response.data.repayments[0].totalAmountToPay
                    }
                  />
                </TransactionReportTableHeader>
              )}
              {state?.response.data?.arrears && (
                <TransactionReportTableHeader reportType="arrears" reportHeading="Arrears Report">
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
                <TransactionReportTableHeader reportType="outstanding" reportHeading="Outstanding Balances Report">
                  <Outstanding
                    data={state?.response.data.outstanding}
                    page="report"
                  />
                </TransactionReportTableHeader>
              )}
              {state?.response.data?.default && (
                <TransactionReportTableHeader reportType="default" reportHeading="Defaulters Report">
                  <Default reports={state?.response.data.default[0].paymentSchedule} 
                    totalAmountLeft={state?.response.data.default[0].grandTotalOutStanding} 
                    totalAmountPaid={state?.response.data.default[0].totalAmountPaid} 
                    totalWeeklyAmount={state?.response.data.default[0].totalAmountToPay} />

                </TransactionReportTableHeader>
              )}
              {state?.response.data?.payments && (
                <TransactionReportTableHeader reportType="payments" reportHeading="Payments Report">
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
