"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toCapitalized, formatDate } from "@/app/lib/utils";
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

export default function ClientDetails({ client }: { client: any }) {
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);

  const avatarUrl = `/uploads/${client.avarta}`;

  return (
    <main className="p-5 h-full flex flex-col w-full">
      <section className="flex h-full flex-col gap-5 w-full bg-white shadow-md p-2">
        <div className="w-full flex flex-row">
          <div className="w-full h-full flex flex-row items-center gap-10">
            <Image
              src={avatarUrl}
              width={50}
              height={50}
              alt="Profile image"
              className="w-44 h-44 rounded-full"
            />
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
          <p className="text-lg font-sans font-bold ml-10 flex items-center">
            {" "}
            <CgDetailsMore />
            Personal Details
          </p>
          <div className="w-full h-full flex flex-row  justify-between px-10">
            <div className="w-full">
              <p className="text-base font-sans font-semibold">First name</p>
              <span>{client.first_name}</span>
            </div>
            <div className="w-full">
              <p className="text-base font-sans font-semibold">Last name</p>
              <span>{client.last_name}</span>
            </div>
            <div className="w-full">
              <p className="text-base font-sans font-semibold">Nick name</p>
              <span>{client.nick_name}</span>
            </div>
            <div className="w-full">
              <p className="text-base font-sans font-semibold">Title</p>
              <span>{client.title}</span>
            </div>
            <div className="w-full">
              <p className="text-base font-sans font-semibold">System ID</p>
              <span>{client.systemId}</span>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div className="w-full h-full flex flex-col gap-3 justify-between px-10">
          <p className="text-lg font-sans font-bold">
            Address and Card Information
          </p>
          <div className="w-full h-full flex flex-row justify-between">
            <div className="w-full">
              <p className="text-base font-sans font-semibold flex items-center">
                <FaMobileRetro />
                Mobile
              </p>
              <span>{client.mobile}</span>
            </div>
            <div className="w-full">
              <p className="text-base font-sans font-semibold flex items-center gap-3">
                <FaAddressCard />
                ID Type
              </p>
              <span>{client.idType}</span>
            </div>
            <div className="w-full">
              <p className="text-base font-sans font-semibold flex items-center gap-3">
                <FaRegIdCard />
                ID Number
              </p>
              <span>{client.idNumber}</span>
            </div>
            <div className="w-full">
              <p className="text-base font-sans font-semibold flex items-center gap-3">
                <FaLocationDot />
                Location
              </p>
              <span>{client.residence}</span>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div className="w-full h-full flex flex-col gap-3 justify-between px-10">
          <p className="text-lg font-sans font-bold">Union and Branch</p>
          <div className="w-full h-full flex flex-row justify-between">
            <div className="w-full">
              <p className="text-base font-sans font-semibold">Union name</p>
              <span>{client.union}</span>
            </div>
            <div className="w-full">
              <p className="text-base font-sans font-semibold flex items-center gap-3">
                <FaLocationDot />
                Union Location
              </p>
              <span>{client.unionLocation}</span>
            </div>
            <div className="w-full">
              <p className="text-base font-sans font-semibold flex items-center gap-3">
                <FaCodeBranch />
                Branch
              </p>
              <span>{client.branch.branchName}</span>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div className="w-full h-full flex flex-col gap-3 justify-between px-10">
          <p className="text-lg font-sans font-bold">
            Marriage details and gender
          </p>
          <div className="w-full h-full flex flex-row justify-between">
            <div className="w-full">
              <p className="text-base font-sans font-semibold">
                Marital Status
              </p>
              <span>{toCapitalized(client.maritalStatus)}</span>
            </div>
            <div className="w-full">
              <p className="text-base font-sans font-semibold flex items-center gap-3">
                <FaTransgenderAlt />
                Gender
              </p>
              <span>{toCapitalized(client.gender)}</span>
            </div>
            <div className="w-full">
              <p className="text-base font-sans font-semibold flex items-center gap-3">
                <MdDateRange />
                Date of birth
              </p>
              <span>{formatDate(client.dob)}</span>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div className="w-full h-full flex flex-col gap-3 justify-between px-10">
          <p className="text-lg font-sans font-bold">
            Staff associated and client status
          </p>
          <div className="w-full h-full flex flex-row justify-between">
            <div className="w-full">
              <p className="text-base font-sans font-semibold">Staff name</p>
              <span>
                {client.staff.first_name} {client.staff.other_names}{" "}
                {client.staff.last_name}
              </span>
            </div>
            <div className="w-full">
              <p className="text-base font-sans font-semibold">Staff Role(s)</p>
              <span>{client.staff.roles.join(", ")}</span>
            </div>
            <div className="w-full">
              <p className="text-base font-sans font-semibold">Client status</p>
              <span>
                {client.client_status === "in-active"
                  ? "In active"
                  : "Active"}
              </span>
            </div>
          </div>
        </div>
        <Modal setModalOpen={setOpenModalEdit} modalOpen={openModalEdit} width="max-w-3xl">
          <EditClient client={client}/>
        </Modal>
      </section>
    </main>
  );
}
