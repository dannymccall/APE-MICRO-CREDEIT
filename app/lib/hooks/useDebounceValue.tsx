import { useEffect, useState } from "react";

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

