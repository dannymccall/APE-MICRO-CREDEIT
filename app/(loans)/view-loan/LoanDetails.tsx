"use client";

import React, { useState } from "react";
import { ILoanApplication } from "@/app/lib/backend/models/loans.model";
import Image from "next/image";
import LoanClientDetails from "@/app/component/loans/LoanClientDetails";
import LoanGuarantorDetails from "@/app/component/loans/LoanGuarantorDetails";
import PaymentSchedule from "@/app/component/loans/PaymentSchedule";
import { MdModeEdit } from "react-icons/md";
import LoanAccountDetails from "@/app/component/loans/LoanDetails";
import TabComponent from "@/app/component/loans/TabsComponent";

export type LoanDetailsProps = {
  loan: ILoanApplication | any;
};
const LoanDetails: React.FC<LoanDetailsProps> = ({ loan }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const clientAvarta = `/uploads/${loan.client.avarta}`;
  const guarantorAvarta = `/uploads/${loan.guarantor.avarta}`;

  const today: Date = new Date("2025-01-25");
  const arreas: [] = loan.paymentSchedule.schedule.filter(
    (schedule: any) => today > new Date(schedule.nextPayment)
  );
  console.log(loan.paymentSchedule.schedule)
  const tabs = [
    {
      label: "Loan Application Details",
      content: <LoanAccountDetails loan={loan} activeTab={0} />,
    },
    {
      label: "Payment Schedule",
      content: (
        <PaymentSchedule
          schedules={loan.paymentSchedule.schedule}
          activeTab={1}
        />
      ),
    },
    {
      label: "Arrears",
      content:
        arreas.length > 0 ? (
          <PaymentSchedule schedules={arreas} activeTab={2} />
        ) : (
          <h1>No Arrears</h1>
        ),
    },
  ];

  return (
    <main className="p-5 py-10 h-full flex flex-col w-full">
      <section className="flex w-full h-full flex-col gap-5  bg-white shadow-md p-2">
        <div className="flex flex-col w-full gap-3">
          <div className="flex w-full justify-between items-center">
            <h1 className="text-lg font-sans font-semibold">Client Details</h1>
            <MdModeEdit
              className="text-violet-800 mr-20"
              size={25}
              cursor={"pointer"}
              // onClick={() => setOpenModalEdit(true)}
            />
          </div>
          <div className="flex w-full gap-3 items-center">
            <div className="h-full flex flex-row items-center gap-10">
              <Image
                src={clientAvarta}
                width={100}
                height={100}
                alt="Profile image"
                className=" rounded-md"
              />
            </div>
            <LoanClientDetails client={loan.client} />
          </div>
        </div>
        <div className="divider"></div>
        <div className="flex flex-col w-full gap-3">
          <div className="flex w-full justify-between items-center">
            <h1 className="text-lg font-sans font-semibold">
              Guarantor Details
            </h1>
            <MdModeEdit
              className="text-violet-800 mr-20"
              size={25}
              cursor={"pointer"}
              // onClick={() => setOpenModalEdit(true)}
            />
          </div>
          <div className="flex w-full gap-3 items-center">
            <div className="h-full flex flex-row items-center gap-10">
              <Image
                src={guarantorAvarta}
                width={100}
                height={100}
                alt="Profile image"
                className=" rounded-md"
              />
            </div>
            <LoanGuarantorDetails guarantor={loan.guarantor} />
          </div>
        </div>
        <div className="divider"></div>
        <div className="flex flex-col w-full gap-3">
          <div className="flex w-full justify-between items-center">
            <h1 className="text-lg font-sans font-semibold">Loan Details</h1>
            <MdModeEdit
              className="text-violet-800 mr-20"
              size={25}
              cursor={"pointer"}
              // onClick={() => setOpenModalEdit(true)}
            />
          </div>
          <TabComponent tabs={tabs} />
        </div>
      </section>
    </main>
  );
};

export default LoanDetails;
