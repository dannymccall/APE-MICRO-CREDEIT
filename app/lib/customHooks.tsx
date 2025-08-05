"use client";

import {  makeRequest } from "./helperFunctions";

// import { useDebounceValue } from '@/app/lib/customHooks';

// Utility function to fetch from localStorage

// Custom hook


interface Disbursement {
  _id: string;
  totalDisbursement: number;
}

interface Outstanding {
  _id: string;
  outStandingBalance: number;
}

interface Repayment {
  _id: string;
  monthlyRepayment: number;
}
export const useDashboardData = async () => {
  try {
    // const response = await import("@/app/api/dashboard/route");
    // const data: any = await (await response.GET()).json();
    const data = await makeRequest("/api/dashboard", {
      method: "GET",
      cache: "no-store",
    });
    const {
      monthlyDisbursement,
      monthlyOutstandingBalance,
      totalUsers,
      totalClients,
      totalOutstandingBalance,
      totalArrears,
      totalRepayment,
      monthlyRepayment,
      totalDisbursement,
      todayRepayment,
      todayDisbursement,
      activities,
    } = data;

    const disbursementMonths: string[] = monthlyDisbursement.map(
      (disbursement: Disbursement) => disbursement._id
    );
    const disbursementMonthValues: number[] = monthlyDisbursement.map(
      (disbursement: Disbursement) => disbursement.totalDisbursement
    );

    const oustandingMonths: string[] = monthlyOutstandingBalance.map(
      (outstanding: Outstanding) => outstanding._id
    );
    const oustandingMonthValues: string[] = monthlyOutstandingBalance.map(
      (outstanding: Outstanding) => outstanding.outStandingBalance
    );

    const repaymentMonths: string[] = monthlyRepayment.map(
      (repayment: Repayment) => repayment._id
    );
    const repaymentMonthValues: string[] = monthlyRepayment.map(
      (repayment: Repayment) => repayment.monthlyRepayment
    );

    return {
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
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};
