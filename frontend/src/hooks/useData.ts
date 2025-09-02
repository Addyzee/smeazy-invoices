import { useUserDetailsStore } from "../store";
import { useGetUserDetails } from "./useAPIs";

export const useUserName = (): string => {
  const userDetails = useUserDetailsStore((state) => state.userDetails);
  const username = useLocalStorage("username");
  const query = useGetUserDetails();
  if (userDetails) return userDetails.username;
  if (username) return username;
  if (query.data) return query.data.username;
  throw new Error("No username found");
};

const useLocalStorage = (item: string) => {
  const storedValue = localStorage.getItem(item);
  if (storedValue) return JSON.parse(storedValue);
  return null;
};
