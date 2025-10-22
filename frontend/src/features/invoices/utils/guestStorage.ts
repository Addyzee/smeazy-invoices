import { useQueryClient } from "@tanstack/react-query";
import { useCreateInvoice } from "../hooks/useAPIs";
import {
  type InvoiceCreate,
  type InvoiceType,
  type InvoiceUpdate,
} from "../types";
import { useUserDetailsStore } from "../../../store";

export const GUEST_STORAGE_KEYS = {
  INVOICES: "guest_invoices",
};
export const getGuestInvoices = (): InvoiceType[] => {
  const data = localStorage.getItem(GUEST_STORAGE_KEYS.INVOICES);
  return data ? JSON.parse(data) : [];
};

export const saveGuestInvoices = (invoices: InvoiceType[]) => {
  localStorage.setItem(GUEST_STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
};

const simulateCreatedInvoice = (invoice: InvoiceCreate): InvoiceType => {
  return {
    ...invoice,
    line_items: invoice.line_items.map((item) => ({
      ...item,
      transaction_value: item.quantity * item.unit_price,
    })),
    customer_name: invoice.customer.full_name,
    customer_phone: invoice.customer.phone_number,
    invoice_number: `INV-${Math.floor(Math.random() * 1000000)}`,
    created_at: new Date().toISOString(),
  };
};

const simulateUpdatedInvoice = (
  invoice: InvoiceType,
  updates: InvoiceUpdate
): InvoiceType => {
  return {
    ...invoice,
    ...updates,
    line_items: updates.line_items.map((item) => ({
      ...item,
      transaction_value: item.quantity * item.unit_price,
    })),
  };
};

export const addGuestInvoice = (invoice: InvoiceCreate): InvoiceType => {
  const invoices = getGuestInvoices();
  const newInvoice = {
    ...invoice,
    id: crypto.randomUUID(), // Generate local ID
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const simulatedInvoice = simulateCreatedInvoice(newInvoice);
  invoices.push(simulatedInvoice);
  saveGuestInvoices(invoices);
  return simulatedInvoice;
};

export const updateGuestInvoice = (
  invoice_number: string,
  data: InvoiceUpdate
): InvoiceType => {
  const invoices = getGuestInvoices();
  const index = invoices.findIndex(
    (inv) => inv.invoice_number === invoice_number
  );

  if (index === -1) {
    throw new Error("Invoice not found");
  }

  invoices[index] = {
    ...invoices[index],
    ...simulateUpdatedInvoice(invoices[index], data),
  };

  saveGuestInvoices(invoices);
  return invoices[index];
};

export const deleteGuestInvoice = (invoice_number: string): void => {
  const invoices = getGuestInvoices();
  const filtered = invoices.filter(
    (inv) => inv.invoice_number !== invoice_number
  );
  saveGuestInvoices(filtered);
};

export const useClearGuestData = () => {
  const queryClient = useQueryClient();
  const { useGuestAccount } = useUserDetailsStore();

  return () => {
    if (useGuestAccount) {
      localStorage.removeItem(GUEST_STORAGE_KEYS.INVOICES);
    }
    queryClient.removeQueries({ queryKey: ["invoices"] });
    queryClient.invalidateQueries({ queryKey: ["invoices"] });
  };
};

const transformToInvoiceCreate = (
  invoice: InvoiceType,
  username: string
): InvoiceCreate => ({
  username,
  business_name: invoice.business_name,
  total_amount: invoice.total_amount,
  status: invoice.status,
  customer_name: invoice.customer_name,
  customer_phone: invoice.customer_phone,
  customer: {
    full_name: invoice.customer.full_name,
    phone_number: invoice.customer.phone_number,
  },
  line_items: invoice.line_items.map((item) => ({
    product_name: item.product_name,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    type: item.type,
  })),
  due_date: invoice.due_date,
  notes: invoice.notes || "",
});

export const useMigrateGuestData = () => {
  const createInvoice = useCreateInvoice();
  const username = JSON.parse(localStorage.getItem("username") || '""');
  const clearGuestData = useClearGuestData();

  return async () => {
    const guestInvoices = getGuestInvoices();

    if (!guestInvoices.length || !username) {
      if (!username)
        console.error("Username not found. Cannot migrate guest data.");
      return;
    }

    // Upload all invoices in parallel
    const results = await Promise.allSettled(
      guestInvoices.map((invoice) =>
        createInvoice.mutateAsync(transformToInvoiceCreate(invoice, username))
      )
    );

    // Log any failures
    results.forEach((result, i) => {
      if (result.status === "rejected") {
        console.error(`Failed to migrate invoice ${i + 1}:`, result.reason);
      }
    });

    clearGuestData();
  };
};
