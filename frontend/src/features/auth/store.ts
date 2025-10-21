import { create } from "zustand";

type AuthStoreType = {
  selectedAction: "login" | "register" | "proceed" | null;
  setSelectedAction: (action: "login" | "register" | "proceed" | null) => void;
};

export const useAuthStore = create<AuthStoreType>((set) => ({
  selectedAction: null,
  setSelectedAction: (action) => set({ selectedAction: action }),
}));
