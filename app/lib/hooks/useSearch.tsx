import { useEffect, useState } from "react";
import { useDebounceValue } from "./useDebounceValue";
import { makeRequest } from "../helperFunctions";

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



export function useSearch<T>({
  endpoint,
  initialPage = 1,
  limit = 15,
}: UseSearchProps<T>) {
  const [state, setState] = useState<SearchState<T>>({
    data: [],
    loading: true,
    error: null,
    totalPages: 1,
    currentPage: initialPage,
    response: "",
  });
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounceValue(query);

  const fetchData = async (searchQuery = "", page = state.currentPage) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const url = searchQuery.trim()
        ? `${endpoint}?query=${searchQuery}&page=${page}&limit=${limit}`
        : `${endpoint}?page=${page}&limit=${limit}`;
      const response = await makeRequest(url, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.success) {
        setState((prev) => ({
          ...prev,
          data: [],
          response: "No results found",
          loading: false,
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        data: response.data,
        totalPages: response.pagination?.totalPages || 0,
        loading: false,
        response: "",
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        data: [],
        error: "Error fetching data",
        loading: false,
        response: "Error fetching data",
      }));
    }
  };

  const handleSearch = (value: string) => {
    if (value.trim().length > 0) setQuery(value);
  };

  const setCurrentPage = (page: number) => {
    setState((prev) => ({ ...prev, currentPage: page }));
  };

  useEffect(() => {
    fetchData(debouncedQuery, state.currentPage);
  }, [debouncedQuery, state.currentPage]);

  useEffect(() => {
    if (state.currentPage === 1 && !query) {
      fetchData("");
    }
  }, [state.currentPage]);

  return {
    ...state,
    setQuery,
    query,
    handleSearch,
    setCurrentPage,
    refresh: () => fetchData(query),
  };
}