import { usePhoneNumber } from "../../../hooks/useData";
import type { InvoiceType, InvoiceWithType } from "../types";

export const useDistinguishInvoiceType = (invoices: InvoiceType[]): InvoiceWithType[] => {
  const phoneNumber = usePhoneNumber();

  return invoices.map((invoice) => {
    if (invoice.customer_phone === phoneNumber) {
      return {
        ...invoice,
        type: "personal",
        status: invoice.status === "sent" ? "received" : invoice.status,
      };
    }
    return { ...invoice, type: "business" };
  });
};
