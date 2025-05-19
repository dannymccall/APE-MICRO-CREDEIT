"use client";

import { useEffect, useMemo, useState } from "react";
import { getFromLocalStorage, makeRequest } from "./helperFunctions";
import { io, Socket } from "socket.io-client";
import Toast from "../component/toast/Toast";
import { FaCircleCheck } from "react-icons/fa6";
// import { useDebounceValue } from '@/app/lib/customHooks';

// Utility function to fetch from localStorage

// Custom hook
export const useLogginIdentity = () => {
  const [logginIdentity, setLogginIdentity] = useState<any>(null);

  // Memoize the stored logginIdentity from localStorage
  const savedLogginIdentity = useMemo(() => {
    if (typeof window !== "undefined") {
      const stored: any = getFromLocalStorage("logginIdentity");
      return stored ? JSON.parse(stored) : null;
    }
  }, []);

  // Set state when savedLogginIdentity is available
  useEffect(() => {
    if (savedLogginIdentity) {
      setLogginIdentity(savedLogginIdentity);
    }
  }, [savedLogginIdentity]);

  return logginIdentity;
};

export interface CustomFile {
  name: string;
  lastModified: number;
  lastModifiedDate: Date;
  webkitRelativePath: string;
  size: number;
  // Add other properties if needed, for example:
  // type: string;
}

export const initialState: any = {
  searchTerm: "",
  isOpen: false,
  clients: [] as any[],
  selectedClient: {
    clientId: "",
    clientName: "",
  },
  principal: 0,
  loading: false,
  error: null as string | null,
  interest: 0,
  processingFee: 0,
  advanceFee: 0,
  expectedDisbursementDate: "",
  expectedFirstRepayment: "",
  users: [] as any[],
  passport: "",
  errors: {},
  activeTab: 0,
  loanProduct: "",
  fund: "",
  loanTerms: "",
  repaymentFrequency: "",
  registrationFee: "",
  loanPurpose: "",
  loanOfficer: "",
  type: "",
  client: "",
  guarantorFullName: "",
  guarantorOccupation: "",
  guarantorPassport: null,
  guarantorResidence: "",
  guarantorUnionName: "",
  guarantorMobile: "",
};

// Define action types
type Action =
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_IS_OPEN"; payload: boolean }
  | { type: "SET_CLIENTS"; payload: any[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SELECTED_CLIENT"; payload: any }
  | { type: "SET_PRINCIPAL"; payload: number }
  | { type: "SET_INTEREST"; payload: any }
  | { type: "SET_PROCESSING_FEE"; payload: number }
  | { type: "SET_ADVANCE_FEE"; payload: number }
  | { type: "SET_EXPECTED_DISBURSMENT_DATE"; payload: string }
  | { type: "SET_FIRST_REPAYMENT_DATE"; payload: string }
  | { type: "SET_USERS"; payload: any[] }
  | { type: "SET_PASSPORT"; payload: string }
  | { type: "SET_FORM_ERRORS"; payload: any }
  | { type: "SET_ACTIVE_TAB"; payload: number }
  | { type: "SET_LOADING_PRODUCT"; payload: string }
  | { type: "SET_FUND"; payload: string }
  | { type: "SET_LOAN_TERMS"; payload: number }
  | { type: "SET_REPAYMENT_FREQUENCY"; payload: number }
  | { type: "SET_REGISTRATION_FEE"; payload: number }
  | { type: "SET_LOAN_PURPOSE"; payload: string }
  | { type: "SET_LOAN_OFFICER"; payload: string }
  | { type: "SET_TYPE"; payload: string }
  | { type: "SET_CLIENT"; payload: string }
  | { type: "SET_GUARANTOR_FULL_NAME"; payload: string }
  | { type: "SET_GUARANTOR_OCCUPATION"; payload: string }
  | { type: "SET_GUARANTOR_PASSPORT"; payload: CustomFile }
  | { type: "SET_GUARANTOR_RESIDENCE"; payload: string }
  | { type: "SET_GUARANTOR_UNION_NAME"; payload: string }
  | { type: "SET_GUARANTOR_MOBILE"; payload: string }
  | { type: "SET_GUARANTOR_MOBILE"; payload: string }
  | { type: "RESET_STATE" };
// Reducer function
export const useReducerHook = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_IS_OPEN":
      return { ...state, isOpen: action.payload };
    case "SET_CLIENTS":
      return { ...state, clients: action.payload };
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_SELECTED_CLIENT":
      return { ...state, selectedClient: action.payload };
    case "SET_PRINCIPAL":
      return { ...state, principal: action.payload };
    case "SET_INTEREST":
      return { ...state, interest: action.payload };
    case "SET_PROCESSING_FEE":
      return { ...state, processingFee: action.payload };
    case "SET_ADVANCE_FEE":
      return { ...state, advanceFee: action.payload };
    case "SET_EXPECTED_DISBURSMENT_DATE":
      return { ...state, expectedDisbursementDate: action.payload };
    case "SET_FIRST_REPAYMENT_DATE":
      return { ...state, expectedFirstRepayment: action.payload };
    case "SET_PASSPORT":
      return { ...state, passport: action.payload };
    case "SET_FORM_ERRORS":
      return { ...state, errors: action.payload };
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };
    case "SET_LOADING_PRODUCT":
      return { ...state, loanProduct: action.payload };
    case "SET_FUND":
      return { ...state, fund: action.payload };
    case "SET_LOAN_TERMS":
      return { ...state, loanTerms: action.payload };
    case "SET_REPAYMENT_FREQUENCY":
      return { ...state, repaymentFrequency: action.payload };
    case "SET_REGISTRATION_FEE":
      return { ...state, registrationFee: action.payload };
    case "SET_LOAN_PURPOSE":
      return { ...state, loanPurpose: action.payload };
    case "SET_LOAN_OFFICER":
      return { ...state, loanOfficer: action.payload };
    case "SET_TYPE":
      return { ...state, type: action.payload };
    case "SET_CLIENT":
      return { ...state, client: action.payload };
    case "SET_GUARANTOR_FULL_NAME":
      return { ...state, guarantorFullName: action.payload };
    case "SET_GUARANTOR_OCCUPATION":
      return { ...state, guarantorOccupation: action.payload };
    case "SET_GUARANTOR_PASSPORT":
      return { ...state, guarantorPassport: action.payload };
    case "SET_GUARANTOR_RESIDENCE":
      return { ...state, guarantorResidence: action.payload };
    case "SET_GUARANTOR_UNION_NAME":
      return { ...state, guarantorUnionName: action.payload };
    case "SET_GUARANTOR_MOBILE":
      return { ...state, guarantorMobile: action.payload };
    case "RESET_STATE":
      return { ...initialState };
    default:
      return state;
  }
};

export function getLoanInfomation(type: string) {
  let interestRate: number = 0;
  switch (type.toLowerCase()) {
    case "monthly":
      interestRate = 10.67;
      break;
    case "weekly":
      interestRate = 2.67;
      break;
    default:
      return "invalid type";
  }

  return interestRate;
}


export const usefetchBranches = async () => {
  try {
    const [clientResponse, usersResponse] = await Promise.all([
      makeRequest("/api/clients", { method: "GET", cache: "no-store" }),
      makeRequest("/api/users", { method: "GET", cache: "no-store" }),
    ]);

    return { clientResponse, usersResponse };
  } catch (error) {
    console.error("Error fetching branches:", error);
    // Return a fallback value to ensure the return type is consistent
    return { clientResponse: null, usersResponse: null };
  }
};

export function useDebounceValue(value: string, time = 250) {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timeOut: NodeJS.Timeout = setTimeout(() => {
      setDebounceValue(value);
    }, time);

    return () => clearTimeout(timeOut);
  }, [value, time]);

  return debounceValue;
}


const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

interface ILogginIdentity {
  fullName: string,
  userRoles: string[];
  userName: string
}



export const useSocket = (logginIdentity: ILogginIdentity) => {
  const [message, setMessage] = useState<string>("");
  const [showNotification, setShowNotification] = useState<boolean>(false);


  const clearToast = () => {
    let timeOut: NodeJS.Timeout;
    timeOut = setTimeout(() => {
      setMessage("");
      setShowNotification(false)
    }, 5000);

    return () => clearTimeout(timeOut)
  }
  useEffect(() => {
    if (!logginIdentity) return; // Ensure logginIdentity exists before running

    const socket = io(SOCKET_URL);

    const userRoles: string[] = logginIdentity.userRoles || [];
    console.log(userRoles)

    switch (true) {
      case userRoles.includes("Admin"):
        socket.on("notifyAdmin", (msg) => {
          setMessage(msg);
          setShowNotification(true);
          clearToast()
        });

        // socket.on("loanApproved", (msg) => {
        //   setMessage(msg);
        //   setShowNotification(true);
        //   clearToast()
        // });

        break;

      case userRoles.includes("Loan officer"):
        console.log("connecting...")
        socket.on("connect", () => {
          console.log("Connected to WebSocket server");
          socket.emit("join", logginIdentity.userName);
        });

        
        socket.on("notifyLoanofficer", (msg) => {
          setMessage(msg);
          setShowNotification(true);
          clearToast()
        });

        socket.on("loanApproved", (msg) => {
          setMessage(msg);
          setShowNotification(true);
          clearToast()
        });
        break;

      default:
        console.warn("No matching role for WebSocket events.");
    }

   
    return () => {
     
      socket.disconnect(); // Cleanup on unmount
    };
  }, [logginIdentity]); // Only run when logginIdentity changes

  return { message, showNotification };
};



export const useGenerateDocument = async (
  reportGenerationRef: React.RefObject<HTMLDivElement>,
  type: "pdf" | "excel",
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!reportGenerationRef.current) return;

  setLoading(true);

  // Get the HTML content of the report
  const html = reportGenerationRef.current.outerHTML;

  try {
    const res = await fetch(`/api/generate-document/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html }),
    });

    if (!res.ok) throw new Error(`Failed to generate ${type.toUpperCase()}`);

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    // Download the file
    const a = document.createElement("a");
    a.href = url;
    a.download = `report.${type === "pdf" ? "pdf" : "xlsx"}`;
    document.body.appendChild(a);
    a.click();
    a.remove();

  } catch (error) {
    console.error(`Error generating ${type.toUpperCase()}:`, error);
  } finally {
    setLoading(false);
  }
};

interface UseSearchProps<T> {
  endpoint: string;
  initialPage?: number;
  limit?: number;
}

interface SearchState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  response: string;
}

export function useSearch<T>({ endpoint, initialPage = 1, limit = 10 }: UseSearchProps<T>) {
  const [state, setState] = useState<SearchState<T>>({
    data: [],
    loading: true,
    error: null,
    totalPages: 1,
    currentPage: initialPage,
    response: ''
  });
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounceValue(query);

  const fetchData = async (searchQuery = '', page = state.currentPage) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const url = searchQuery.trim()
    ? `${endpoint}?query=${searchQuery}&page=${page}&limit=${limit}`
    : `${endpoint}?page=${page}&limit=${limit}`;
      const response = await makeRequest(url, {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.success) {
        setState(prev => ({
          ...prev,
          data: [],
          response: 'No results found',
          loading: false
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        data: response.data,
        totalPages: response.pagination?.totalPages || 0,
        loading: false,
        response: ''
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        data: [],
        error: 'Error fetching data',
        loading: false,
        response: 'Error fetching data'
      }));
    }
  };

  const handleSearch = (value: string) => {
    setQuery(value);
  };

  const setCurrentPage = (page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  };

useEffect(() => {
  fetchData(debouncedQuery, state.currentPage);
}, [debouncedQuery, state.currentPage]);

  useEffect(() => {
    if (state.currentPage === 1 && !query) {
      fetchData('');
    }
  }, [state.currentPage]);

  return {
    ...state,
    query,
    handleSearch,
    setCurrentPage,
    refresh: () => fetchData(query)
  };
}


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
  try{
    // const response = await import("@/app/api/dashboard/route");
    // const data: any = await (await response.GET()).json();
    const data = await makeRequest("/api/dashboard", {method: "GET", cache: "no-store"});
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
  }catch(error){
    console.error("Error fetching dashboard data:", error);
  }
}