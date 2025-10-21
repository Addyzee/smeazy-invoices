import { type InvoiceCreate, type InvoiceType, type InvoiceUpdate } from "../types";

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
    return ({
        ...invoice,
        line_items: invoice.line_items.map((item) => ({
            ...item,
            transaction_value: item.quantity * item.unit_price,
        })),
        customer_name: invoice.customer.full_name,
        customer_phone: invoice.customer.phone_number,
        invoice_number: `GUEST-${Math.floor(Math.random() * 1000000)}`,
        created_at: new Date().toISOString(),
    });
}

const simulateUpdatedInvoice = (invoice: InvoiceType, updates: InvoiceUpdate): InvoiceType => {
    return ({
        ...invoice,
        ...updates,
        line_items: updates.line_items.map((item) => ({
            ...item,
            transaction_value: item.quantity * item.unit_price,
        })),
    });
}

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

export const updateGuestInvoice = (invoice_number: string, data: InvoiceUpdate ): InvoiceType => {
  const invoices = getGuestInvoices();
  const index = invoices.findIndex(inv => inv.invoice_number === invoice_number);

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
  const filtered = invoices.filter(inv => inv.invoice_number !== invoice_number);
  saveGuestInvoices(filtered);
};

export const clearGuestData = () => {
  Object.values(GUEST_STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};