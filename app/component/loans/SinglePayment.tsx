import React, { useEffect, useState } from "react";
import ClientSelector from "./ClientSelector";
import { IClient } from "@/app/lib/backend/models/client.model";
import {
  fetchClients,
  fetchPaymentClients,
  formatDate,
  makeRequest,
} from "@/app/lib/helperFunctions";
import PaymentDetails, { PaymentClientDetails } from "./PaymentDetails";

const SinglePayment = () => {
  const [clients, setClients] = useState<IClient[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);
  const [loanPaymentDetails, setLoanPaymentDetails] = useState<
    PaymentClientDetails | any
  >();
  const [message, setMessage] = useState<string>("");
  useEffect(() => {
    (async () => {
      try {
        const clientsData = await fetchClients();
        console.log(clientsData.data);
        setClients(clientsData.data);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      }
    })();
  }, []);

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSearchChange = async (term: string) => {
    setSearchTerm(term);
    try {
      const clientsData = await fetchClients(term);
      console.log({ clientsData });
      setClients(clientsData.data);
    } catch (error) {
      console.error("Error fetching filtered clients:", error);
    }
  };

  const handleClientSelect = async (client: IClient | any) => {
    // const today: Date = new Date("2025-01-20"); // Example fixed date
    const res: PaymentClientDetails | any = await fetchPaymentClients(
      client.systemId,
      "singlePayment"
    );
    console.log(res.data);
    console.log(loanPaymentDetails);
    // Filter loans by comparing the date strings

    if (!res.success) {
      setMessage(res.message);
      setIsOpen(false)
      setLoanPaymentDetails({})
      return;
    }
    setMessage("");
    setLoanPaymentDetails(res.data);
    setIsOpen(false);
  };

  return (
    <>
  
      <ClientSelector
        clients={clients}
        searchTerm={searchTerm}
        isOpen={isOpen}
        onClientSelect={handleClientSelect}
        onSearchChange={handleSearchChange}
        onToggleDropdown={handleToggleDropdown}
        selectedClient={selectedClient}
      />
    


      {loanPaymentDetails ? <PaymentDetails client={loanPaymentDetails} /> : ""}
      {message && (
        <div className="w-96 flex bg-[url('../public/checkout.jpg')] bg-cover bg-center p-2 mt-5 rounded-lg">
          <p className="text-white text-lg font-sans font-semibold">
            {message}
          </p>
        </div>
      )}
    </>
  );
};

export default SinglePayment;
