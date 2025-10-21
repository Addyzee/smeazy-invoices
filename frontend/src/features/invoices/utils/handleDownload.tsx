
import { pdf } from "@react-pdf/renderer";
import type { InvoiceType } from "../types";
import { InvoicePDFDocument } from "../components/InvoicePDF";

export const handleDownload = async (invoice: InvoiceType) => {
  try {
    // Generate PDF
    const blob = await pdf(<InvoicePDFDocument invoice={invoice} />).toBlob();

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.invoice_number}.pdf`;
    link.click();

    // Cleanup
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  }
};
