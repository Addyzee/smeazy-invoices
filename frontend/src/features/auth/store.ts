import { create } from "zustand";

type AuthStoreType = {
  selectedAction: "login" | "register" | null;
  setSelectedAction: (action: "login" | "register" | null) => void;
};

export const useAuthStore = create<AuthStoreType>((set) => ({
  selectedAction: null,
  setSelectedAction: (action) => set({ selectedAction: action }),
}));
