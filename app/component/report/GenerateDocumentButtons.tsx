import React from "react";
import { FaFilePdf } from "react-icons/fa6";
import { GrDocumentCsv } from "react-icons/gr";

interface ButtonProps {
  generatePdf: () => void;
  generateCSV: () => void;
  pending: boolean;
}

const GenerateDocumentButtons = ({
  generateCSV,
  generatePdf,
  pending,
}: ButtonProps) => {
  return (
    <div className="flex  phone:flex-col tablet:flex-row laptop:flex-row desktop:flex-row gap-2 items-center justify-end m-2 phone:m-3 tablet:m-4 laptop:m-5 desktop:m-5 w-full px-2 phone:px-3 tablet:px-4 laptop:px-6 desktop:px-6">
      <button
        className="btn btn-sm w-full tablet:w-auto laptop:w-auto desktop:w-autoflex flex-row gap-2 items-center justify-center text-blue-700 text-xs phone:text-sm tablet:text-sm laptop:text-sm desktop:text-sm  hover:text-blue-900 font-semibold mb-2 tablet:mb-0 laptop:mb-0 desktop:mb-0"
        onClick={generateCSV}
      >
        {pending ? (
          <span className="loading loading-ring loading-xs"></span>
        ) : (
          <>
            <span className="phone:hidden tablet:inline">Download </span>Excel
            <GrDocumentCsv className="hidden phone:inline" />
          </>
        )}
      </button>
      {/* <button
        className="btn btn-sm w-full tablet:w-auto laptop:w-auto desktop:w-auto flex flex-row gap-2 items-center justify-center text-red-700 text-xs phone:text-sm tablet:text-sm laptop:text-sm desktop:text-sm hover:text-red-900 font-semibold"
        onClick={generatePdf}
      >
        {pending ? (
          <span className="loading loading-ring loading-xs"></span>
        ) : (
          <>
            <span className="phone:hidden tablet:inline">Download </span>PDF
            <FaFilePdf className="hidden phone:inline" />
          </>
        )}
      </button> */}
    </div>
  );
};

export default GenerateDocumentButtons;
