import React from "react";
import { FaFilePdf } from "react-icons/fa";
import { GrDocumentCsv } from "react-icons/gr";

interface Props {
  children: React.ReactNode;
  startDate: string;
  endDate: string;
  
}
const ReportTemplate: React.FC<Props> = ({
  children,
  startDate,
  endDate,
  
}) => {
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
               
              </div>
              <div className="w-full h-1 bg-gray-300"></div>
              {React.Children.count(children) > 0 ? (
                children
              ) : (
                <p>No reports available.</p>
              )}
            </div>
          </main>
        </>
      </main>
    </>
  );
};

export default ReportTemplate;
