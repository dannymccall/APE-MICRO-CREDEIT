import { makeRequest } from "@/app/lib/utils";
import ClientDetails from "../ClientDetails";

export default async function Page({
  params,
}: {
  params:Promise<{ clientId: string }>;
}) {
  const clientId = (await params).clientId;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const fullUrl = `${baseUrl}/api/clients?clientId=${encodeURIComponent(
    clientId
  )}`;

  try {

  
      const client = await makeRequest(fullUrl, { method: "GET" , cache: "no-store",});
      console.log(client)
  
    
   

    async function onEditClient(){
      const client = await makeRequest(fullUrl, { method: "GET" });
      return client.data
    }
    if (!client?.data) {
      return (
        <main>
          <p>Client data not found.</p>
        </main>
      );
    }

    return <ClientDetails client={client.data}/>;
  } catch (error) {
    console.error("Error fetching client data:", error);
    return (
      <main>
        <p>Failed to load client information. Please try again later.</p>
      </main>
    );
  }
}
