"use client";

import React, { useEffect, useState } from "react";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import { useRouter } from "next/navigation";
import SinglePayment from "@/app/component/loans/SinglePayment";
import TabsComponent from "@/app/component/loans/TabsComponent";
import { fetchClients } from "@/app/lib/utils";
import { IClient } from "@/app/lib/backend/models/client.model";
import BulkPayment from "@/app/component/loans/BulkPayment";

const LoanRecovery = () => {
  const router = useRouter();
  const [clients, setClients] = useState<IClient[]>([]);

  const breadcrumbsLinks = [
    { name: "Dashboard", href: "/dashboard" },
    {
      name: "loan-recovery",
      href: "/loan-recovery",
    },
  ];

  const tabs = [
    {
      label: "Single Payment",
      content: <SinglePayment />,
    },
    {
      label: "Bulk Payment",
      content: <BulkPayment clients={clients} paymentDate={""} />,
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        const clientsData = await fetchClients();
        console.log(clientsData.data);
        setClients(
          clientsData.data.filter((client: any) => {
            // Filter clients that have at least one loan with paymentStatus "not completed"
            return client.loans.some((loan: any) => loan.paymentStatus === "not completed");
          })
        );
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      }
    })();
  }, []);

  useEffect(() => {
    console.log(clients)
  },[clients])
  const onClick = () => router.push("/");
  return (
    <>
      <InfoHeaderComponent
        route={"LOAN RECOVERY"}
        links={breadcrumbsLinks}
        title="Dashboard"
        onClick={onClick}
      />
      <main className="m-5 p-5 bg-white shadow-md rounded">
        <TabsComponent tabs={tabs} />
      </main>
    </>
  );
};

export default LoanRecovery;
