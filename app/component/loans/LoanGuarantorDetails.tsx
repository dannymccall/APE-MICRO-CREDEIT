import React from "react";
import { IGuatantor } from "@/app/lib/backend/models/guarantor.models";

const LoanGuarantorDetails = ({ guarantor }: { guarantor: IGuatantor }) => {
  return (
    <main className="w-full overflow-x-auto">

    <table className="w-full">
      <thead>
        <tr className="bg-violet-200">
          <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
            System ID
          </th>
          <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
            Guarantor Full Name
          </th>
          <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
            Guarantor Occupation
          </th>
          <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
          Guarantor Union Name
          </th>
          <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
          Guarantor Residence
          </th>
          <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
          Guarantor Mobile
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="">
          <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
            {guarantor.systemId}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
            {guarantor.guarantorFullName}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
            {guarantor.guarantorOccupation}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
            {guarantor.guarantorUnionName}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
            {guarantor.guarantorResidence}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
            {guarantor.mobile}
          </td>
        </tr>
      </tbody>
    </table>
    </main>
  );
};

export default LoanGuarantorDetails;
