"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toCapitalized, formatDate } from "@/app/lib/helperFunctions";
import { MdDateRange, MdModeEdit } from "react-icons/md";
import { CgDetailsMore } from "react-icons/cg";
import {
  FaMobileRetro,
  FaLocationDot,
  FaCodeBranch,
  FaRegIdCard,
  FaAddressCard,
} from "react-icons/fa6";
import Modal from "@/app/component/Modal";
import EditClient from "@/app/ui/clients/editClient";
import { FaTransgenderAlt } from "react-icons/fa";
import Loan from "@/app/component/loans/Loan";
import { useRouter } from "next/navigation";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import ImageComponent from "@/app/component/Image";
import TableHeader, { TableColumn } from "@/app/component/TableHeader";

const columns: TableColumn[] = [
      {
        key: "system-id",
        label: "System ID",
        align: "right",
      },
      {
        key: "loan_product",
        label: "Loan Product",
        align: "right",
      },
      {
        key: "principal",
        label: "Principal",
        align: "right",
      },
      {
        key: "loan_officer",
        label: "Loan Officer",
        align: "right",
      },
      {
        key: "interest_rate",
        label: "Interest Rate",
        align: "right",
      },
      {
        key: "loan_payment_status",
        label: "Loan Payment Status",
        align: "right",
      },
      {
        key: "actions",
        label: "Actions",
        align: "right",
      },
    ];
export default function ClientDetails({
  client,
  clientId,
}: {
  client: any;
  clientId: string;
}) {
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);

  const router = useRouter();
  const avatarUrl = `/uploads/${client.avarta}`;
  console.log({avatarUrl})
  const onClick = () => router.push("/manage-client");

  const breadcrumbsLinks = [
    { name: "Dashboard", href: "/dashboard" },

    {
      name: "view-client",
      href: `/view-client/${clientId}`,
    },
  ];
  return (
    <React.Fragment>
      <InfoHeaderComponent
        route={"View Client"}
        links={breadcrumbsLinks}
        title="Manage Client"
        onClick={onClick}
      />
      <main className="px-5 py-10 h-full flex flex-col w-full">
        <section className="flex h-full flex-col flex-wrap gap-5 bg-white p-2 overflow-x-auto">
          <div className="w-full flex flex-row ml-10">
            <div className="w-full h-full flex flex-row items-center gap-10">
              <div className="h-full flex flex-row items-center gap-10">
                {process.env.NEXT_PUBLIC_NODE_ENV !== "development" ? (
                  <ImageComponent src={client.avarta} className="rounded-md"/>
                ) : (
                  <Image
                    src={avatarUrl}
                    width={100}
                    height={100}
                    alt="Profile image"
                    className="rounded-md"
                  />
                )}
              </div>
              <span className="text-lg font-sans font-bold">
                {client.first_name} {client.last_name}
              </span>
            </div>
            <MdModeEdit
              className="text-violet-800 mr-20"
              size={25}
              cursor={"pointer"}
              onClick={() => setOpenModalEdit(true)}
            />
          </div>
          <div className="w-full h-full flex flex-col gap-3">
            <p className="text-base font-sans font-bold ml-10 flex items-center">
              {" "}
              <CgDetailsMore />
              Personal Details
            </p>
            <div className="w-full h-full flex justify-between px-10 desktop:flex-row laptop:flex-row tablet:flex-row   phone:flex-col phone:gap-4 ">
              <div className="w-full">
                <p className="text-sm font-sans font-semibold">First Name</p>
                <span>{client.first_name}</span>
              </div>
              <div className="w-full">
                <p className="text-sm font-sans font-semibold">Last Name</p>
                <span>{client.last_name}</span>
              </div>
              <div className="w-full">
                <p className="text-sm font-sans font-semibold">Nick Name</p>
                <span>{client.nick_name}</span>
              </div>
              <div className="w-full">
                <p className="text-sm font-sans font-semibold">Title</p>
                <span>{client.title}</span>
              </div>
              <div className="w-full">
                <p className="text-sm font-sans font-semibold">System ID</p>
                <span>{client.systemId}</span>
              </div>
            </div>
          </div>
          <div className="divider w-full"></div>
          <div className="w-full h-full flex flex-col gap-3 justify-between px-10 ">
            <p className="text-base font-sans font-bold">
              Address and Card Information
            </p>
            <div className="w-full h-full flex flex-row justify-between desktop:flex-row laptop:flex-row tablet:flex-row   phone:flex-col phone:gap-4 ">
              <div className="w-full">
                <p className="text-sm font-sans font-semibold flex items-center">
                  <FaMobileRetro />
                  Mobile
                </p>
                <span>{client.mobile}</span>
              </div>
              <div className="w-full">
                <p className="text-sm font-sans font-semibold flex items-center gap-3">
                  <FaAddressCard />
                  ID Type
                </p>
                <span>{client.idType}</span>
              </div>
              <div className="w-full">
                <p className="text-sm font-sans font-semibold flex items-center gap-3">
                  <FaRegIdCard />
                  ID Number
                </p>
                <span>{client.idNumber}</span>
              </div>
              <div className="w-full">
                <p className="text-sm font-sans font-semibold flex items-center gap-3">
                  <FaLocationDot />
                  Location
                </p>
                <span>{client.residence}</span>
              </div>
            </div>
          </div>
          <div className="divider w-full"></div>
          <div className="w-full h-full flex flex-col gap-3 justify-between px-10">
            <p className="text-lg font-sans font-bold">Union and Branch</p>
            <div className="w-full h-full flex flex-row justify-between desktop:flex-row laptop:flex-row tablet:flex-row   phone:flex-col phone:gap-4 ">
              <div className="w-full">
                <p className="text-sm font-sans font-semibold">Union Name</p>
                <span>{client.union}</span>
              </div>
              <div className="w-full">
                <p className="text-sm font-sans font-semibold flex items-center gap-3">
                  <FaLocationDot />
                  Union Location
                </p>
                <span>{client.unionLocation}</span>
              </div>
              <div className="w-full">
                <p className="text-sm font-sans font-semibold flex items-center gap-3">
                  <FaCodeBranch />
                  Branch
                </p>
                <span>{client.branch.branchName}</span>
              </div>
            </div>
          </div>
          <div className="divider w-full"></div>
          <div className="w-full h-full flex flex-col gap-3 justify-between px-10">
            <p className="text-base font-sans font-bold">
              Marriage Details and Gender
            </p>
            <div className="w-full h-full flex flex-row justify-between desktop:flex-row laptop:flex-row tablet:flex-row   phone:flex-col phone:gap-4 ">
              <div className="w-full">
                <p className="text-sm font-sans font-semibold">
                  Marital Status
                </p>
                <span>{toCapitalized(client.maritalStatus)}</span>
              </div>
              <div className="w-full">
                <p className="text-sm font-sans font-semibold flex items-center gap-3">
                  <FaTransgenderAlt />
                  Gender
                </p>
                <span>{toCapitalized(client.gender)}</span>
              </div>
              <div className="w-full">
                <p className="text-sm font-sans font-semibold flex items-center gap-3">
                  <MdDateRange />
                  Date of Birth
                </p>
                <span>{formatDate(client.dob)}</span>
              </div>
            </div>
          </div>
          <div className="divider w-full"></div>
          <div className="w-full h-full flex flex-col gap-3 justify-between px-10">
            <p className="text-base font-sans font-bold">
              Loan Officer and Client Status
            </p>
            <div className="w-full h-full flex flex-row justify-between desktop:flex-row laptop:flex-row tablet:flex-row   phone:flex-col phone:gap-4 ">
              <div className="w-full">
                <p className="text-sm font-sans font-semibold">Staff Name</p>
                <span>
                  {client.staff.first_name} {client.staff.other_names}{" "}
                  {client.staff.last_name}
                </span>
              </div>
              <div className="w-full">
                <p className="text-sm font-sans font-semibold">Staff Role(s)</p>
                <span>{client.staff.roles.join(", ")}</span>
              </div>
              <div className="w-full">
                <p className="text-sm font-sans font-semibold">Client Status</p>
                <span>{ client.client_status && toCapitalized(client.client_status)}</span>
              </div>
            </div>
          </div>
          <Modal
            setModalOpen={setOpenModalEdit}
            modalOpen={openModalEdit}
            width="phone:w-96 max-w-3xl"
          >
            <EditClient client={client} setOpenModalEdit={setOpenModalEdit} />
          </Modal>
          <div className="divider w-full"></div>
          <div className="px-10 mb-14">
            <h1 className=" font-semibold font-sans text-lg mb-2">
              Loans Acquired
            </h1>
            <table className="table  w-full">
              {/* head */}
             <TableHeader columns={columns}/>
              <tbody className="relative">
                {client.loans.map((loan: any | any, index:any) => (
                  <Loan
                    key={loan._id}
                    loan={loan}
                    loanOfficer={`${client.staff.first_name} ${client.staff.other_names} ${client.staff.last_name}`}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </React.Fragment>
  );
}
