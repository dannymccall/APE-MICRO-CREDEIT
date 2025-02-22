"use client";

import React, { useEffect, useState, Suspense, lazy } from "react";
import { makeRequest } from "@/app/lib/helperFunctions";
// import UsersList from "./usersList";
import { useRouter } from "next/navigation";

const ActivityList = lazy(() => import("./activityList"));

import { LoadingDivs } from "@/app/component/Loading";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import { IActivities } from "./activityList";
const AllActivities = () => {
  const [activities, setActivities] = useState<IActivities[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState<boolean>(true)
  async function fetchUsers() {
    try {
      const activities: any = await makeRequest(
        `api/activities?page=${currentPage}&limit=${10}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );
      setActivities(activities.data);
      setTotalPages(activities.pagination.totalPages);
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }


  useEffect(() => {
    fetchUsers();
  }, [currentPage]);
  const router = useRouter();

  const breadcrumbsLinks = [
    { name: "Dashboard", href: "/dashboard" },
    {
      name: "view-activities",
      href: "/view-activities",
    },
  ];

  const onClick = () => router.back()

  // const editUser = (updatedUser: any, id: string) => {
  //   console.log({updatedUser, id})
  //   if(id === updatedUser._id)
  //   setUsers((prevUsers) =>
  //     prevUsers.map((user) =>
  //       user._id === id ? { ...user, ...updatedUser } : user
  //     )
  //   );
  //   console.log(users)
  // };
  

  return (
    <main className="min-w-full min-h-full mx-auto">
      <InfoHeaderComponent
        route={"All Activities"}
        links={breadcrumbsLinks}
        title="Go Back"
        onClick={onClick}
      />
      <div className="w-full h-full text-center mg-5 flex flex-col gap-4 bg-white"></div>
      {loading ? <>
        <LoadingDivs /> 
        <LoadingDivs /> 
        <LoadingDivs /> 
      </>
      :   
      <Suspense fallback={<LoadingDivs />}>
        <div className="p-10">
          {
            activities && activities.length > 0 ? 
            <ActivityList
              activities={activities}
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />: <h1 className="text-center text-2xl">No Activities Found</h1>
          }
        </div>
      </Suspense>
    }
    </main>
  );
};

export default AllActivities;
