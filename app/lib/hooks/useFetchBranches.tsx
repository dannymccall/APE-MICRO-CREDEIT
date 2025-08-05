import { makeRequest } from "../helperFunctions";

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
