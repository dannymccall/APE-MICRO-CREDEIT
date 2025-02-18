"use client";

import React, { useState } from "react";
import { ILoanApplication } from "@/app/lib/backend/models/loans.model";
import Image from "next/image";
import LoanClientDetails from "@/app/component/loans/LoanClientDetails";
import LoanGuarantorDetails from "@/app/component/loans/LoanGuarantorDetails";
import PaymentSchedule, {OutstandingDetails} from "@/app/component/loans/PaymentSchedule";
import { MdModeEdit } from "react-icons/md";
import LoanAccountDetails from "@/app/component/loans/LoanDetails";
import TabComponent from "@/app/component/loans/TabsComponent";
import Link from "next/link";
import { IoIosArrowRoundForward } from "react-icons/io";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import { useRouter } from "next/navigation";
import { getOutstandingBalances, makeRequest } from "@/app/lib/helperFunctions";
import Toast from "@/app/component/toast/Toast";
import { FaCircleCheck } from "react-icons/fa6";
export type LoanDetailsProps = {
  loan: ILoanApplication | any;
  loanId: string;
};
const LoanDetails: React.FC<LoanDetailsProps> = ({ loan, loanId }) => {
  const router = useRouter();
  const clientAvarta = `/uploads/${loan.client.avarta}`;
  const guarantorAvarta = `/uploads/${loan.guarantor.avarta}`;
  const [showToast, setShowToast] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  // const today: Date = new Date("2025-01-25");
  const arreas = loan.paymentSchedule.schedule.filter(
    (schedule: any) => schedule.status === "arrears"
  ) as any[];

  const outStandingLoans = loan.paymentSchedule.schedule.filter(
    (schedule: any) => schedule.outStandingBalance > 0
  ) as any[];

  async function handleArrearsPayment(
    amount: number,
    loanId: string,
    clientId: string,
    nextPayment: string
  ) {
    console.log(amount, loanId, nextPayment, clientId);
    const body = {
      0: {
        amount,
        loanId,
        clientId,
        nextPayment,
      },
    };
    const response = await makeRequest(
      "/api/payments?paymentType=singlePayment",
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );
    if (response.success) {
      setModalOpen(false);
      setShowToast(true);

      
      const timeOut: NodeJS.Timeout = setTimeout(() => {
        setShowToast(false);
      }, 100);

      return () => clearTimeout(timeOut);
    }
  }
  const data = getOutstandingBalances(loan);
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
          loan={loan}
          handleArrearsPayment={() => {}}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      ),
    },
    {
      label: "Arrears",
      content:
        arreas.length > 0 ? (
          <PaymentSchedule
            schedules={arreas}
            activeTab={2}
            loan={loan}
            handleArrearsPayment={handleArrearsPayment}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
          />
        ) : (
          <h1>No Arrears</h1>
        ),
    },
    {
      label: "Outstanding",
      content:
        outStandingLoans.length > 0 ? (
        <OutstandingDetails data={data}/>
        ) : (
          <h1>No Outstanding loans</h1>
        ),
    },
  ];

  const onClick = () => router.push("/manage-loan");
  const breadcrumbsLinks = [
    { name: "Dashboard", href: "/dashboard" },

    {
      name: "view-loan",
      href: `/view-loan/${loanId}`,
    },
  ];
  return (
    <React.Fragment>
      {showToast && (
        <Toast Icon={FaCircleCheck} message="Payment Successfu" title="" />
      )}
      <InfoHeaderComponent
        route={"Manage Loan"}
        links={breadcrumbsLinks}
        title="Manage loan"
        onClick={onClick}
      />
      <main className="p-5 py-10 h-full flex flex-col w-full overflow-x-auto">
        <section className="flex w-full h-full flex-col gap-5  bg-white rounded-md p-2">
          <div className="flex flex-col w-full gap-3">
            <div className="flex w-full justify-between items-center place-items-center">
              <h1 className="text-lg font-sans font-semibold">
                Client Details
              </h1>
              <Link
                href={`/view-client/${loan.client.systemId}`}
                className="text-violet-600 hover:text-violet-800 flex gap-3 items-center text-sm link-btn"
              >
                View Full Details{" "}
                <IoIosArrowRoundForward
                  size={20}
                  className="relative icon-move-left"
                />
              </Link>
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
    </React.Fragment>
  );
};

export default LoanDetails;
