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
export async function useDashboardValues(url: string) {
  // const BASE_URL =
  //   process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  const response:any = await fetch(url, {
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
    activities
  } = response;
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

  return [
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
    activities
  ];
}
