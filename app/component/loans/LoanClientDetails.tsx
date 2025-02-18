import React from "react";
import { IClient } from "@/app/lib/backend/models/client.model";
const LoanClientDetails = ({ client }: { client: IClient}) => {
  return (
    <main className="w-full overflow-x-auto">

    <table className={`w-full`}>
      <thead>
        <tr className="bg-violet-200">
          <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
            System ID
          </th>
          <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
            First Name
          </th>
          <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
            Last Name
          </th>
          <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
            Nick Name
          </th>
          <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
            Gender
          </th>
          <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
            Title
          </th>
          <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
            Mobile
          </th>
          <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
            ID Type
          </th>
          <th className="text-sm font-sans font-medium text-gray-700 p-2 border text-left">
            Card Number
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="">
          <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
            {client.systemId}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
            {client.first_name}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
            {client.last_name}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
            {client.nick_name}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
            {client.gender}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
            {client.title}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
            {client.mobile}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
            {client.idType}
          </td>
          <td className="text-sm font-sans font-normal text-gray-700 p-2 border">
            {client.idNumber}
          </td>
        </tr>
      </tbody>
    </table>
    </main>
  );
};

export default LoanClientDetails;
