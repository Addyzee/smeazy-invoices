import { create } from "zustand";
import type { UserType } from "./features/auth/types";

type UserDetailsStoreType = {
  userDetails: UserType | null;
  setUserDetails: (user: UserType | null) => void;
  clearUserDetails: () => void;
  useGuestAccount: boolean;
  setUseGuestAccount: (value: boolean) => void;
};

export const useUserDetailsStore = create<UserDetailsStoreType>()((set) => ({
  userDetails: null,
  setUserDetails: (user) => set({ userDetails: user }),
  clearUserDetails: () => set({ userDetails: null }),
  useGuestAccount: false,
  setUseGuestAccount: (value) => set({ useGuestAccount: value }),
}));
