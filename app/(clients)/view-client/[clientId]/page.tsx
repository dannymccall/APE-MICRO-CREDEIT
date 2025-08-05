import { lazy, Suspense } from "react";

import { makeRequest } from "@/app/lib/helperFunctions";
// import ClientDetails from "../ClientDetails";
import { LoadingDivs } from "@/app/component/Loaders/Loading";

const ClientDetails = lazy(() => import("../ClientDetails"));

export default async function Page({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const clientId = (await params).clientId;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const fullUrl = `${baseUrl}/api/clients?clientId=${encodeURIComponent(
    clientId
  )}`;

  try {
    // const client = await makeRequest(fullUrl, {
    //   method: "GET",
    //  cache: "no-store",
    // })
    const response = await fetch(fullUrl, {method:"GET", cache:"no-store"});
    const client = await response.json();
  
    if (!client?.data) {
      return (
        <main>
          <p>Client data not found.</p>
        </main>
      );
  }

    return (
      <Suspense fallback={<LoadingDivs />}>
        <ClientDetails client={client.data} clientId={clientId} />;
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
