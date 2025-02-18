import { lazy, Suspense } from "react";

import { makeRequest } from "@/app/lib/helperFunctions";
// import ClientDetails from "../ClientDetails";
import { LoadingDivs } from "@/app/component/Loading";

const LoanDetails = lazy(() => import("../LoanDetails"));

export default async function Page({
  params,
}: {
  params: Promise<{ loanId: string }>;
}) {
  const loanId = (await params).loanId;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const fullUrl = `${baseUrl}/api/loans?loanId=${encodeURIComponent(
    loanId
  )}`;

  try {
    const loan = await makeRequest(fullUrl, {
      method: "GET",
      cache: "no-store",
    });

    console.log(loan)
    if (!loan?.data) {
      return (
        <main>
          <p>Client data not found.</p>
        </main>
      );
    }
 

    return (
      <Suspense fallback={<LoadingDivs />}>
        <LoanDetails loan={loan.data} loanId={loanId}/>;
      </Suspense>
    ) 
  } catch (error) {
    console.error("Error fetching client data:", error);
    return (
      <main>
        <p>Failed to load client information. Please try again later.</p>
      </main>
    );
  }
}
