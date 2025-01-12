import React, { useEffect, useState } from "react";
import ClientSelector from "./ClientSelector";
import { IClient } from "@/app/lib/backend/models/client.model";
import { fetchClients, formatDate, makeRequest } from "@/app/lib/utils";
import PaymentDetails from "./PaymentDetails";

const SinglePayment = () => {
  const [clients, setClients] = useState<IClient[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);
  const [loan, setLoan] = useState<any>([]);

  useEffect(() => {
    (async () => {
      try {
        const clientsData = await fetchClients();
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
      setClients(clientsData.data);
    } catch (error) {
      console.error("Error fetching filtered clients:", error);
    }
  };

  const handleClientSelect = (client: IClient | any) => {
    setSelectedClient(client);

    // const today: Date = new Date("2025-01-20"); // Example fixed date

    // Filter loans by comparing the date strings
    const filteredLoans = client.loans.filter((loan: any) => {
      // const loanDate = new Date(loan.nextPayment);
      return loan.paymentStatus === "not completed";
    });

    setLoan(filteredLoans);
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

      {loan.length > 0 && selectedClient && (
        <PaymentDetails
          client={selectedClient}
          paymentDate={formatDate(loan[0].nextPayment)}
        />
      )}
      {loan.length === 0 && selectedClient && (
        <div className="w-full flex bg-[url('../public/checkout.jpg')] bg-cover bg-center p-2 mt-5 rounded-lg">
          <p className="text-white text-lg font-sans font-semibold">
            No Active Loan for the selected client!
          </p>
        </div>
      )}
    </>
  );
};

export default SinglePayment;
