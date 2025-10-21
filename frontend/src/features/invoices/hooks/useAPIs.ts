import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createInvoiceAPI, deleteInvoiceAPI, getAllUserInvoicesAPI, getUserBusinessInvoicesAPI, getUserCustomerInvoicesAPI, updateInvoiceAPI } from "../api";
import { useUserName } from "../../../hooks/useData";
import type { InvoiceCreate, InvoiceUpdate } from "../types";
import { useInvoiceStore } from "../store";
import { useUserDetailsStore } from "../../../store";
import { addGuestInvoice, updateGuestInvoice, deleteGuestInvoice } from "../utils/guestStorage";
import { clearGuestData } from "../utils/guestStorage";


export const useGetAllUserInvoices = () => {
  const username = useUserName();
  const { useGuestAccount } = useUserDetailsStore();

  const query = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      if (!username) {
        throw new Error("Username is required");
      }
      if (useGuestAccount) {
        const localInvoices = localStorage.getItem("guest_invoices");
        return localInvoices ? JSON.parse(localInvoices) : [];
      }
      const response = await getAllUserInvoicesAPI(username);
      return response;
    },
    enabled: !!username,
  });

  useEffect(() => {
    if (query.error) {
      console.error("Error fetching invoices:", query.error);
    }
  }, [query.error]);

  return query;
};

export const useGetUserBusinessInvoices = () => {
  const username = useUserName();

  const query = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      if (!username) {
        throw new Error("Username is required");
      }
      const response = await getUserBusinessInvoicesAPI(username);
      return response;
    },
    enabled: !!username,
  });

  useEffect(() => {
    if (query.error) {
      console.error("Error fetching invoices:", query.error);
    }
  }, [query.error]);

  return query;
};

export const useGetUserCustomerInvoices = () => {
  const username = useUserName();

  const query = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      if (!username) {
        throw new Error("Username is required");
      }
      console.log("Fetching customer invoices for:", username);
      const response = await getUserCustomerInvoicesAPI(username);
      return response;
    },
    enabled: !!username,
  });

  useEffect(() => {
    if (query.error) {
      console.error("Error fetching invoices:", query.error);
    }
  }, [query.error]);

  return query;
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  const { useGuestAccount } = useUserDetailsStore();
  
  return useMutation({
    mutationFn: async (data: InvoiceCreate) => {
      if (useGuestAccount) {
        // simulate async operation
        await new Promise(resolve => setTimeout(resolve, 100));
        return addGuestInvoice(data);
      }
      const response = await createInvoiceAPI(data);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      console.log(data);
    },
    onError: (error) => {
      console.log(error.message);
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  const { useGuestAccount } = useUserDetailsStore();
  const currentInvoice = useInvoiceStore((state) => state.currentInvoice);

  return useMutation({
    mutationFn: async (data: InvoiceUpdate) => {
      if (!currentInvoice?.invoice_number) {
        throw new Error("Invoice number is required");
      }
      if (useGuestAccount) {
        // simulate async operation
        await new Promise(resolve => setTimeout(resolve, 100));
        return updateGuestInvoice(currentInvoice.invoice_number, data);
      }

      const response = await updateInvoiceAPI(data, currentInvoice.invoice_number);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      console.log(data);
    },
    onError: (error) => {
      console.log(error.message);
    },
  });
};


export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  const { useGuestAccount } = useUserDetailsStore();
  const currentInvoice = useInvoiceStore((state) => state.currentInvoice);

  return useMutation({
    mutationFn: async () => {
      if (!currentInvoice?.invoice_number) {
        throw new Error("Invoice number is required");
      }
      if (useGuestAccount) {
        // simulate async operation
        await new Promise(resolve => setTimeout(resolve, 100));
        return deleteGuestInvoice(currentInvoice.invoice_number);
      }
      const response = await deleteInvoiceAPI(currentInvoice.invoice_number);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (error) => {
      console.log(error.message);
    },
  });
};

export const useClearGuestData = () => {
  const queryClient = useQueryClient();
  const { useGuestAccount } = useUserDetailsStore();

  return () => {
    if (useGuestAccount) {
      clearGuestData();
    }
    queryClient.removeQueries({ queryKey: ["invoices"] });
  };
};