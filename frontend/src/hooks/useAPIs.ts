import { useQuery } from "@tanstack/react-query";
import { useUserDetailsStore } from "../store";
import { getUserDetailsAPI } from "../api";
import { useEffect } from "react";

export const useGetUserDetails = () => {
  const { setUserDetails } = useUserDetailsStore();
  const query = useQuery({
    queryKey: ["userDetails"],
    queryFn: async () => {
      const response = await getUserDetailsAPI();
      return response;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime:24 * 60 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    if (query.data) {
      localStorage.setItem("username", JSON.stringify(query.data.username));
      localStorage.setItem("phone_number", JSON.stringify(query.data.phone_number));
      setUserDetails(query.data);
    }
  }, [query.data, setUserDetails]);

  useEffect(() => {
    if (query.error) {
      console.error("Error fetching user details:", query.error);
    }
  }, [query.error]);

  return query;
};