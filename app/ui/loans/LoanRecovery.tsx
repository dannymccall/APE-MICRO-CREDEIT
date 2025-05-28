"use client";

import React, { useEffect, useState } from "react";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import { useRouter } from "next/navigation";
import SinglePayment from "@/app/component/loans/SinglePayment";
import TabsComponent from "@/app/component/loans/TabsComponent";
import {  fetchPaymentClients } from "@/app/lib/helperFunctions";
import BulkPayment from "@/app/component/loans/BulkPayment";
import { PaymentClientDetails } from "@/app/component/loans/BulkPayment";

const LoanRecovery = () => {
  const router = useRouter();
  const [clients, setClients] = useState<PaymentClientDetails | any>();

  const breadcrumbsLinks = [
    { name: "Dashboard", href: "/dashboard" },
    {
      name: "loan-recovery",
      href: "/loan-recovery",
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        const res: PaymentClientDetails | any = await fetchPaymentClients(
          "",
          "bulkPayment"
        );
        // console.log(res)
        setClients(res);
      } catch (error: any) {
        // console.error("Failed to fetch clients:", error);
        throw new Error ("Failed to fetch clients: ", error)
      }
    })();
  }, []);

  const tabs = [
    {
      label: "Single Payment",
      content: <SinglePayment />,
    },
    {
      label: "Bulk Payment",
      content: <BulkPayment loans={clients} />,
    },
  ];

  const onClick = () => router.push("/");
  return (
    <>
      <InfoHeaderComponent
        route={"LOAN RECOVERY"}
        links={breadcrumbsLinks}
        title="Dashboard"
        onClick={onClick}
      />
      <main className="m-5 p-5 bg-white rounded">
        <TabsComponent tabs={tabs} />
      </main>
    </>
  );
};

export default LoanRecovery;
