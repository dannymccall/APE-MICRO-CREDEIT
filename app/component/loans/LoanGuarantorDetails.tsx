import React from "react";
import { IGuatantor } from "@/app/lib/backend/models/guarantor.models";
import ImageComponent from "../Image";
import Image from "next/image";
import TableHeader, { TableColumn } from "../TableHeader";

const LoanGuarantorDetails = ({
  guarantor,
  loan,
}: {
  guarantor: IGuatantor;
  loan: { guarantor: { avarta: string } };
}) => {
  const env = process.env.NEXT_PUBLIC_NODE_ENV;

  const columns: TableColumn[] = [
    {
      key: "system-id",
      label: "System Id",
      align: "right",
    },
    {
      key: "guarantor-full-name",
      label: "Guarantor Full Name",
      align: "right",
    },
    {
      key: "guarantor-occupation",
      label: "Guarantor Occupation",
      align: "right",
    },
    {
      key: "guarantor-union-name",
      label: "Guarantor Union Name",
      align: "right",
    },
    {
      key: "guarantor_residence",
      label: "Guarantor Residence",
      align: "right",
    },
    {
      key: "guarantor_mobile",
      label: "Guarantor Mobile",
      align: "right",
    },
  ];

  return (
    <>
      <div className="h-full flex flex-row items-center gap-10">
        {env !== "development" ? (
          <ImageComponent
            src={loan.guarantor && loan.guarantor.avarta}
            className="rounded-md"
          />
        ) : (
          <Image
            src={loan.guarantor && `/uploads/${loan.guarantor.avarta}`}
            width={100}
            height={100}
            alt="Profile image"
            className=" rounded-md"
          />
        )}
      </div>
      <main className="w-full overflow-x-auto">
        <table className="w-full">
          <TableHeader columns={columns} />
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
    </>
  );
};

export default LoanGuarantorDetails;
