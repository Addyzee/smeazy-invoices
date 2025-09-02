import { create } from "zustand";
import type { UserType } from "./features/auth/types";

type UserDetailsStoreType = {
  userDetails: UserType | null;
  setUserDetails: (user: UserType) => void;
  clearUserDetails: () => void;
};

export const useUserDetailsStore = create<UserDetailsStoreType>()((set) => ({
  userDetails: null,
  setUserDetails: (user) => set({ userDetails: user }),
  clearUserDetails: () => set({ userDetails: null }),
}));
