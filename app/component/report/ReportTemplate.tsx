import React from "react";
import { FaFilePdf } from "react-icons/fa";
import { GrDocumentCsv } from "react-icons/gr";

interface Props {
  children: React.ReactNode;
  startDate: string;
  endDate: string;
  generatePdf: () => void;
  generateCSV: () => void;
  pending: boolean
}
const ReportTemplate: React.FC<Props> = ({ children, startDate, endDate, generateCSV, generatePdf, pending }) => {
  return (
    <>
      <main className="max-w-full p-2">
        <>
          <main className=" p-3 flex flex-col bg-white-200 h-full">
            <div className="w-full bg-white h-full p-5">
              <div className="w-full  flex desktop:flex-row laptop:flex-row tablet:flex-row phone:flex-col justify-between">
                <div>
                  <h1 className="text-sm font-semibold">
                    Report Generation Details
                  </h1>
                  <p className="text-sm font-semibold">
                    From:{" "}
                    <span className="text-gray-500 italic ml-5">
                      {startDate || "-".repeat(20)}
                    </span>
                  </p>
                  <p className="text-sm font-semibold">
                    To:{" "}
                    <span className="text-gray-500 italic ml-5">
                      {endDate || "-".repeat(20)}
                    </span>
                  </p>
                </div>
                <div className="flex flex-row gap-5 items-center">
                  <button className="btn btn-sm flex flex-row gap-3 items-center text-blue-700 text-sm hover:text-blue-900 font-semibold" onClick={generateCSV}>
                    {
                      pending ? <span className="loading loading-ring loading-xs"></span>
                        : <>
                      
                          Download Excel
                          <GrDocumentCsv />
                        </>

                    }
                   
                  </button>
                  <button className="flex btn btn-sm flex-row gap-3 items-center text-red-700 text-sm hover:text-red-900 font-semibold" onClick={generatePdf}>
                    {
                      pending ? <span className="loading loading-ring loading-xs"></span> :
                        <>
                          Download PDF
                          <FaFilePdf />
                        </>
                    }
                    
                  </button>
                </div>
              </div>
              <div className="w-full h-1 bg-gray-300"></div>
              {React.Children.count(children) > 0 ? children : <p>No reports available.</p>}
            </div>
          </main>
        </>
      </main>
    </>
  );
};

export default ReportTemplate;
