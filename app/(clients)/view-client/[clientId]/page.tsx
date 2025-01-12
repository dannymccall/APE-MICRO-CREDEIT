import { lazy, Suspense } from "react";

import { makeRequest } from "@/app/lib/utils";
// import ClientDetails from "../ClientDetails";
import { LoadingDivs } from "@/app/component/Loading";

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
    const client = await makeRequest(fullUrl, {
      method: "GET",
      cache: "no-store",
    });

    console.log(client)
    if (!client?.data) {
      return (
        <main>
          <p>Client data not found.</p>
        </main>
      );
    }

    return (
      <Suspense fallback={<LoadingDivs />}>
        <ClientDetails client={client.data} />;
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
