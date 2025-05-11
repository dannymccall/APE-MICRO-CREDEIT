"use client";

import React, { lazy, Suspense, useCallback, useEffect, useState } from "react";
import InfoHeaderComponent from "@/app/component/Info-header/Info-Header";
import {
  FiUsers,
  FiDollarSign,
  FiCheckSquare,
  FiBarChart2,
} from "react-icons/fi";
import { FaHandHoldingUsd, FaMoneyBillWave } from "react-icons/fa"; // Font Awesome
import { AiOutlineUserAdd, AiOutlineFileSearch } from "react-icons/ai"; // Ant Design
import { MdOutlineApproval } from "react-icons/md"; // Material Icons
import Link from "next/link";
import { GiCash } from "react-icons/gi";
import { getDashboardData } from "@/app/lib/serverFunctions";
import { formatCurrency, makeRequest } from "@/app/lib/helperFunctions";
import { LoadingDivs } from "@/app/component/Loading";
import { IoIosArrowRoundForward } from "react-icons/io";
import Notifications from "@/app/component/Notification";
// import { useDashboardValues } from "@/app/lib/serverhooks";
import { Activities } from "@/app/component/Dashboard/Activities";
const DynamicChart = lazy(() => import("@/app/component/DynamicChart"));

interface IDashboardStatics {
  icon: React.ElementType;
  statsType: string;
  stats: number;
}

interface DashboardNavigations {
  name: string;
  href: string;
  icon: React.ElementType;
}
interface IActivity {
  createdAt: string;
  activity: string;
  userDetails: {
    first_name: string;
    other_names: string;
    last_name: string;
  };
}

const DashboardUI = () => {
  const [data, setData] = useState<any>({});

  const fetchDashbordData = async () => {
    const response = await makeRequest("/api/dashboard", { method: "GET" });
    console.log({ response });
    setData(response);
  };

  useEffect(() => {
    fetchDashbordData();
  }, []);
  useEffect(() => {
    console.log(data);
  }, []);

  const {
    disbursementMonths,
    disbursementMonthValues,
    oustandingMonths,
    oustandingMonthValues,
    repaymentMonths,
    repaymentMonthValues,
    totalUsers,
    totalClients,
    totalOutstandingBalance,
    totalArrears,
    totalRepayment,
    totalDisbursement,
    todayRepayment,
    todayDisbursement,
    activities,
  } = data;

  console.log({ data }); 
  const dashboardStats: IDashboardStatics[] = [
    { statsType: "Total Clients", stats: totalClients, icon: FiUsers }, // Represents people/users
    { statsType: "Total Users", stats: totalUsers, icon: FiUsers }, // Also represents users
    {
      statsType: "Total Arrears",
      stats: formatCurrency(totalArrears),
      icon: FiBarChart2,
    }, // Represents financial metrics
    {
      statsType: "Total Outstanding",
      stats: formatCurrency(totalOutstandingBalance),
      icon: FiDollarSign,
    }, // Represents outstanding amounts
    {
      statsType: "Total Disbursement",
      stats: formatCurrency(totalDisbursement),
      icon: FaHandHoldingUsd,
    }, // Symbolizes disbursement
    {
      statsType: "Total Payments",
      stats: formatCurrency(totalRepayment),
      icon: FaMoneyBillWave,
    }, // Represents repayment/money flow
  ];

  const dashboardNavgations: DashboardNavigations[] = [
    { name: "Apply Loan", href: "/add-loan", icon: GiCash },
    { name: "Loan Repayment", href: "/loan-recovery", icon: FaHandHoldingUsd },
    {
      name: "Approve Loan Repayments",
      href: "/approve-loan-payment",
      icon: MdOutlineApproval,
    },
    { name: "Add Client", href: "/add-client", icon: AiOutlineUserAdd },
    {
      name: "Generate Report",
      href: "/report",
      icon: AiOutlineFileSearch,
    },
  ];

  const generateChartOptions = (title: string) => ({
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: title },
    },
  });

  const disbursementBarData = {
    labels: disbursementMonths,
    datasets: [
      {
        label: "Disbursements",
        data: disbursementMonthValues,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
      },
    ],
  };

  const repaymentLine = {
    labels: repaymentMonths,
    datasets: [
      {
        label: "Disbursements",
        data: repaymentMonthValues,
        backgroundColor: [
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 159, 64)",
          "rgb(255, 99, 132)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
      },
    ],
  };

  const outstandingBalancePie = {
    labels: oustandingMonths,
    datasets: [
      {
        label: "Disbursements",
        data: oustandingMonthValues,
        backgroundColor: [
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 159, 64)",
          "rgb(255, 99, 132)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
      },
    ],
  };

  const disbursementOptions = generateChartOptions(
    "Monthly Disbursement Statistics"
  );
  const repaymentOptions = generateChartOptions("Monthly Payment Statistics");
  const outStandingOptions = generateChartOptions(
    "Monthly Outstanding Balance Statistics"
  );
  return (
    <>
      {/* <InfoHeaderComponent 
        route={route} 
        links={breadcrumbsLinks} 
        title="Dashboard" 
      /> */}
      <Notifications />
      {
        Object.keys(data).length > 0 ? 
      <main className="w-full h-full flex flex-col p-5 gap-10">
        <section className="flex flex-row w-full flex-wrap flex-grow-0  items-center justify-center">
          {dashboardStats.map((stats, index) => (
            <div
              key={index}
              className="w-60 h-24 flex flex-col justify-between bg-white m-2  rounded-md px-2 py-3"
            >
              <div className="flex flex-row justify-between items-center">
                <span className="text-violet-500 font-semibold text-base">
                  {stats.stats}
                </span>
                <p>
                  <stats.icon />
                </p>
              </div>
              <span className="text-slate-500 text-sm font-semibold">
                {stats.statsType}
              </span>
            </div>
          ))}
        </section>
        <section className="flex flex-row justify-center w-full items-center flex-wrap mt-4">
          {dashboardNavgations.map((navigation, index) => (
            <Link
              href={navigation.href}
              key={index}
              className="flex flex-col glass items-center justify-between bg-violet-600 text-slate-50 p-3 w-60 rounded hover:scale-105 hover:bg-violet-400 transition ease-in-out duration-150 font-sans font-semibold text-sm m-3 h-20"
            >
              <navigation.icon className="text-xl" />
              {navigation.name}
            </Link>
          ))}
        </section>
        <section className="w-full flex flex-col">
          <div className="w-full flex flex-row gap-5 laptop:flex-row desktop:flex-row tablet:flex-col phone:flex-col">
            <div className="w-full bg-white">
              <Suspense fallback={<LoadingDivs />}>
                <DynamicChart
                  type="bar"
                  data={disbursementBarData}
                  options={disbursementOptions}
                />
              </Suspense>
            </div>
            <div className="w-full flex flex-col gap-5">
              <table className="table border bg-white p-4">
                <thead>
                  <tr>
                    <td>Todays Report</td>
                    <td>Amount</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-semibold text-sm">
                      Total Disbursement
                    </td>
                    <td className="font-semibold text-sm">
                      {formatCurrency(todayDisbursement)}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold text-sm">Total Repayment</td>
                    <td className="font-semibold text-sm">
                      {formatCurrency(todayRepayment)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className=" bg-white">
                <DynamicChart
                  type="pie"
                  data={outstandingBalancePie}
                  options={outStandingOptions}
                  className=""
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full">
          <div className="w-full flex gap-5 laptop:flex-row desktop:flex-row tablet:flex-col phone:flex-col">
            <div className="w-full bg-white h-full place-items-center">
              <DynamicChart
                type="polarArea"
                data={repaymentLine}
                options={repaymentOptions}
              />
            </div>
            <div className="w-full bg-white m-0 flex flex-col gap-2 p-2">
              <p className="font-semibold text-lg text-gray-500">
                Recent Activities
              </p>
              <div className="w-full flex flex-col gap-2">
                <Activities activities={activities} />
              </div>
              <Link
                href="/view-activities"
                className="w-full flex gap-4 items-center text-violet-500 link-btn text-base font-mono"
              >
                See All Activities{" "}
                <IoIosArrowRoundForward
                  size={20}
                  className="relative icon-move-left"
                />
              </Link>
            </div>
          </div>
        </section>
      </main>: <>
          <LoadingDivs />
          <LoadingDivs />
          <LoadingDivs />
      </>
      }
    </>
  );
};

export default DashboardUI;
