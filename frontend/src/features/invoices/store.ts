import { create } from "zustand";
import type { InvoiceType } from "./types";


type invoiceStore = {
    popUpType: "create" | "update" | "view"| "duplicate" | null;
    setPopUpType: (type: "create" | "update" | "view" | "duplicate" | null) => void;
    currentInvoice: InvoiceType | null
    setCurrentInvoice: (invoice: InvoiceType | null) => void;
}

export const useInvoiceStore = create<invoiceStore>((set) => ({
    popUpType: null,
    setPopUpType: (type) => set({ popUpType: type }),
    currentInvoice: null,
    setCurrentInvoice(invoice) {
        set({ currentInvoice: invoice })
    },
}));