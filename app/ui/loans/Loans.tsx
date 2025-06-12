"use client";

import React, { Suspense } from "react";
import { ILoanApplication } from "@/app/lib/backend/models/loans.model";
import dynamic from "next/dynamic";

import { useRouter } from "next/navigation";
import SearchInput from "@/app/component/Search/SearchInput";

// const LoanList = lazy(() => import("./loanList"));
const LoanList = dynamic(() => import("./loanList"), { ssr: false });
import { LoadingDivs } from "@/app/component/Loaders/Loading";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import {  useSearch } from "@/app/lib/customHooks";
import TableSkeletonLoader from "@/app/component/TableSkeletonLoader";
const AllLoans = () => {
  // const [loans, setLoans] = useState<ILoanApplication[]>([]);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  // const [loading, setLoanding] = useState<boolean>(true);
  // const [query, SetQuery] = useState<string>("");
  // const debounceValue = useDebounceValue(query);
  // const [response, setResponse] = useState<string>("");

  const {
    data: loans,
    loading,
    query,
    handleSearch,
    totalPages,
    currentPage,
    setCurrentPage,
    response,
    refresh
  } = useSearch<ILoanApplication>({
    endpoint: 'api/loans',
    initialPage: 1,
    limit: 10
  });

  // async function fetchLoans(query = "") {
  //   try {
  //     const endpoint = query.trim()
  //       ? `api/loans?query=${query}`
  //       : `api/loans?page=${currentPage}&limit=10`;

  //     const loans: any = await makeRequest(endpoint, {
  //       method: "GET",
  //       cache: "no-store",
  //     });

  //     if (!loans.success) {
  //       setLoans([]);
  //       setResponse("No active loans found");
  //       setLoanding(false);
  //       return;
  //     }

  //     setLoans(loans.data);
  //     setTotalPages(loans.pagination?.totalPages || 0);
  //     setLoanding(false);
  //   } catch (error) {
  //     console.error("Failed to fetch loans:", error);
  //     setLoans([]);
  //     setResponse("Error fetching loans");
  //     setLoanding(false);
  //   }
  // }

  // const handleDelete = () => {
  //   fetchLoans();
  // };

  // // Update the handleChange function
  // function handleChange(value: string): void {
  //   SetQuery(value);
  //   // If value is empty, fetch paginated results
  //   if (!debounceValue.trim()) {
  //     fetchLoans("");
  //     return;
  //   }
  //   // Only fetch if there's a search value
  //   if (debounceValue.trim().length > 0) {
  //     fetchLoans(debounceValue);
  //   }
  // }

  // // Update the useEffect to use the debounced value
  // useEffect(() => {
  //   if (debounceValue !== undefined) {
  //     fetchLoans(debounceValue);
  //   }
  // }, [debounceValue]);

  // // Remove the currentPage useEffect or modify it to:
  // useEffect(() => {
  //   if (currentPage === 1 && !query) {
  //     fetchLoans(""); // Only fetch on initial load if no query
  //   }
  // }, [currentPage]);

  const router = useRouter();

  const breadcrumbsLinks = [
    { name: "Dashboard", href: "/dashboard" },
    {
      name: "manage-loan",
      href: "/manage-loan",
    },
  ];

  const onClick = () => router.push("/add-loan");

  // const editUser = (updatedUser: any, id: string) => {
  //   console.log({updatedUser, id})
  //   if(id === updatedUser._id)console.log("correct")
  //   setUsers((prevUsers) =>
  //     prevUsers.map((user) =>
  //       user._id === id ? { ...user, ...updatedUser } : user
  //     )
  //   );
  //   console.log(users)
  // };

  return (
    <main className="min-w-full min-h-full">
      <InfoHeaderComponent
        route={"All Loans"}
        links={breadcrumbsLinks}
        title="Add Loan"
        onClick={onClick}
      />
      <div className="w-full h-full text-center mg-5 flex flex-col gap-4"></div>
      {loading ? (
        <TableSkeletonLoader />
      ) : (
        <Suspense fallback={<TableSkeletonLoader />}>
          <div className="p-10 w-full">
            {(loans.length > 0 || query) && (
              <SearchInput
                value={query}
                onChange={handleSearch}
                placeholder="Search loans..."
              />
            )}
            {loans.length > 0 ? (
              <React.Fragment>
                <LoanList
                  loans={loans}
                  onDelete={refresh}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                  editUser={refresh}
                />
              </React.Fragment>
            ) : (
              <div className="bg-white p-3 rounded-md border-t-2 border-t-violet-600">
                <span>{response}</span>
              </div>
            )}
          </div>
        </Suspense>
      )}
    </main>
  );
};

export default AllLoans;
