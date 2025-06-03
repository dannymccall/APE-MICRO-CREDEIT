import { lazy, Suspense } from "react";

import { makeRequest } from "@/app/lib/helperFunctions";
// import ClientDetails from "../ClientDetails";
import { LoadingDivs } from "@/app/api/Loaders/Loading";

const ClientDetails = lazy(() => import("../ClientDetails"));

export default async function Page({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  // const fullUrl = `${baseUrl}/api/clients?clientId=${encodeURIComponent(
  //   clientId
  // )}`;

  try {
    // const client = await makeRequest(fullUrl, {
    //   method: "GET",
    //   cache: "no-store",
    const clientId = (await params).clientId;
    const { GET } = await import("@/app/api/clients/route");
    const request: any = new Request(
      `http://localhost/api/clients?clientId=${encodeURIComponent(clientId)}`
    );
    // });
    const response = await GET(request);
    const client = await response.json();
    console.log(client);
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
