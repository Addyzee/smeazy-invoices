import { usePhoneNumber } from "../../../hooks/useData";
import type { InvoiceType, InvoiceWithType } from "../types";

export const useDistinguishInvoiceType = (invoices: InvoiceType[]): InvoiceWithType[] => {
  const phoneNumber = usePhoneNumber();

  return invoices.map((invoice) => {
    if (phoneNumber === invoice.customer.phone_number) {
      return {
        ...invoice,
        type: "personal",
        status: invoice.status === "sent" ? "received" : invoice.status,
      };
    }
    return { ...invoice, type: "business" };
  });
};
