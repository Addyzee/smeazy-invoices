import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createInvoiceAPI, deleteInvoiceAPI, getUserBusinessInvoicesAPI, updateInvoiceAPI } from "../api";
import { useUserName } from "../../../hooks/useData";
import type { InvoiceCreate, InvoiceUpdate } from "../types";
import { useInvoiceStore } from "../store";

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

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InvoiceCreate) => {
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
  const currentInvoice = useInvoiceStore((state) => state.currentInvoice);

  return useMutation({
    mutationFn: async (data: InvoiceUpdate) => {
      if (!currentInvoice?.invoice_number) {
        throw new Error("Invoice number is required");
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
  const currentInvoice = useInvoiceStore((state) => state.currentInvoice);

  return useMutation({
    mutationFn: async () => {
      if (!currentInvoice?.invoice_number) {
        throw new Error("Invoice number is required");
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