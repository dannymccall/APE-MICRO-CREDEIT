import React from "react";
import { IClient } from "@/app/lib/backend/models/client.model";
import ImageComponent from "../Image";
import Image from "next/image";
import TableHeader, { TableColumn } from "../TableHeader";
import TableBody from "../TableBody";

const LoanClientDetails = ({
  client,
  loan,
}: {
  client: IClient;
  loan: { client: { avarta: string } };
}) => {
  const env = process.env.NEXT_PUBLIC_NODE_ENV;


   const columns: TableColumn[] = [
      {
        key: "system-id",
        label: "System Id",
        align: "right",
      },
      {
        key: "first_name",
        label: "First Name",
        align: "right",
      },
      {
        key: "last_name",
        label: "Last Name",
        align: "right",
      },
      {
        key: "nick_name",
        label: "Nick Name",
        align: "right",
      },
      {
        key: "gender",
        label: "Gender",
        align: "right",
      },
      {
        key: "title",
        label: "Title",
        align: "right",
      },
      {
        key: "mobile",
        label: "Mobile",
        align: "right",
      },
      {
        key: "id_type",
        label: "ID Type",
        align: "right",
      },
       {
        key: "card_number",
        label: "Card Number",
        align: "right",
      },
    ];
  
  return (
    <>
      <div className="h-full flex flex-row items-center gap-10">
        {env !== "development" ? (
          <ImageComponent
            src={loan.client && loan.client.avarta}
            className="rounded-md"
          />
        ) : (
          <Image
            src={loan.client && `/uploads/${loan.client.avarta}`}
            width={100}
            height={100}
            alt="Profile image"
            className=" rounded-md"
          />
        )}
      </div>
      <main className="w-full overflow-x-auto">
        <table className={`w-full`}>
         <TableHeader columns={columns}/>
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
    </>
  );
};

export default LoanClientDetails;
