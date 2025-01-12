import { useEffect, useMemo, useState, useReducer } from "react";
import { getFromLocalStorage } from "./utils";
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
  guarantorPassport:null,
  guarantorResidence: "",
  guarantorUnionName: "",
  guarantorMobile: ""
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
  | { type: "SET_ACTIVE_TAB"; payload: Number }
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
    case "months":
      interestRate = 10.67;
      break;
    default:
      return "invalid type";
  }

  return interestRate;
}
