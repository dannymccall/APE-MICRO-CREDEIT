"use client";
import React, {  Suspense, lazy, useCallback } from "react";
import { IClient } from "@/app/lib/backend/models/client.model";
import { useRouter } from "next/navigation";
import SearchInput from "@/app/component/Search/SearchInput";
const ClientList = lazy(() => import("./clientList"));
import { LoadingDivs } from "@/app/component/Loading";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import {  useSearch } from "@/app/lib/customHooks";

const AllClients = () => {
  // const [clients, setClients] = useState<IClient[]>([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  // const [loading, setLoading] = useState(true); // Loading state
  // const [error, setError] = useState<string | null>(null);
  // const [query, SetQuery] = useState<string>("");
    // const debounceValue = useDebounceValue(query);
  const router = useRouter();

  // const fetchUsers = useCallback(async () => {
  //   setLoading(true); // Start loading
  //   setError(null);
  //   try {
  //     const response = await makeRequest(
  //       `/api/clients?page=${currentPage}&limit=10`,
  //       {
  //         method: "GET",
  //         cache: "no-store",
  //       }
  //     );
  //     setClients(response.data);
  //     setTotalPages(response.pagination.totalPages);
  //   } catch (err) {
  //     setError("Failed to fetch users. Please try again later.");
  //     console.error("Fetch Error:", err);
  //   } finally {
  //     setLoading(false); // Stop loading
  //   }
  // }, [currentPage]);

  // useEffect(() => {
  //   fetchUsers();
  // }, [fetchUsers]);

    const {
      data: clients,
      loading,
      query,
      handleSearch,
      totalPages,
      currentPage,
      setCurrentPage,
      response,
      refresh
    } = useSearch<IClient>({
      endpoint: 'api/clients',
      initialPage: 1,
      limit: 10
    });
  
    console.log(clients)

  const onClick = useCallback(() => router.push("/add-client"), [router]);

  const breadcrumbsLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Manage Clients", href: "/manage-client" },
  ];

  // const handleDelete = () => {
  //   fetchUsers();
  // };

  const editClient = (updatedUser: any, id: string) => {
    // console.log({updatedUser, id})
    // if(id === updatedUser._id)console.log("correct")
    // setUsers((prevUsers) =>
    //   prevUsers.map((user) =>
    //     user._id === id ? { ...user, ...updatedUser } : user
    //   )
    // );
    // console.log(users)
  };

  return (
    <main className="min-w-full min-h-full mx-auto">
      <InfoHeaderComponent
        route="All Clients"
        links={breadcrumbsLinks}
        title="Add Client"
        onClick={onClick}
      />
      <div className="w-full h-full text-center mg-5 flex flex-col gap-4 bg-white"></div>
      {/* {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded-md">
          <p>{error}</p>
        </div>
      )} */}
      {loading ? ( // Show loading state
        <LoadingDivs />
      ) : (
        <Suspense fallback={<LoadingDivs />}>
          <div className="p-10">
           {(clients.length > 0 || query) && (
              <SearchInput
                value={query}
                onChange={handleSearch}
                placeholder="Search loans..."
              />
            )}
            {clients.length > 0 ? (
              <React.Fragment>
                <ClientList
                  clients={clients}
                  onDelete={refresh}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                  editClient={refresh}
                />
              </React.Fragment>
            ) : (
              <div className="bg-white p-3 rounded-md border-t-2 border-t-violet-600">
                <span>No Clients</span>
              </div>
            )}
          </div>
        </Suspense>
      )}
    </main>
  );
};

export default AllClients;
