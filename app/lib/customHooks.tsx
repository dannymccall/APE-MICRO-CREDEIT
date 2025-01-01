import { useEffect, useMemo, useState } from "react";
import { getFromLocalStorage } from "./utils";
// Utility function to fetch from localStorage


// Custom hook
export const useLogginIdentity = () => {
  const [logginIdentity, setLogginIdentity] = useState<any>(null);

  // Memoize the stored logginIdentity from localStorage
  const savedLogginIdentity = useMemo(() => {
    if(typeof window !== 'undefined'){
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
