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
 
    try {
      const loanId = (await params).loanId;
      const { GET } = await import("@/app/api/loans/route");
      const request: any = new Request(
        `http://localhost/api/loans?loanId=${encodeURIComponent(loanId)}`
      );
      const response = await GET(request);
      const loan = await response.json();
      console.log(loan);
     

    console.log(loan);
    if (!loan?.data) {
      return (
        <main>
          <p>Client data not found.</p>
        </main>
      );
    }

    return (
      <Suspense fallback={<LoadingDivs />}>
        <LoanDetails loan={loan.data} loanId={loanId} />;
      </Suspense>
    );
  } catch (error) {
    console.error("Error fetching client data:", error);
    return (
      <main>
        <p>Failed to load client information. Please try again later.</p>
      </main>
    );
  }
}
