import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { statusThemes } from "../ui/themes";
import type { InvoiceType } from "../types";
import { useInvoiceStore } from "../store";
import { handleDownload } from "../utils/handleDownload";

// Define styles for PDF document
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "white",
    fontSize: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#e5e7eb",
  },
  headerLeft: {
    flexDirection: "column",
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 12,
    color: "#6b7280",
  },
  businessName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  section: {
    marginBottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionColumn: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 10,
    color: "#4b5563",
    marginBottom: 3,
  },
  infoBold: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 3,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#374151",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableCell: {
    fontSize: 10,
    color: "#4b5563",
  },
  colDescription: {
    flex: 3,
  },
  colQuantity: {
    flex: 1,
    textAlign: "center",
  },
  colPrice: {
    flex: 1.5,
    textAlign: "right",
  },
  colAmount: {
    flex: 1.5,
    textAlign: "right",
  },
  totalsContainer: {
    alignItems: "flex-end",
    marginTop: 20,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 220,
    paddingVertical: 6,
  },
  totalsFinalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 220,
    paddingVertical: 10,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: "#374151",
  },
  totalsLabel: {
    fontSize: 10,
    color: "#4b5563",
  },
  totalsValue: {
    fontSize: 10,
    color: "#1f2937",
    fontWeight: "bold",
  },
  totalsFinal: {
    fontSize: 12,
    fontWeight: "bold",
  },
  notes: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#f9fafb",
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6",
  },
  notesTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 6,
  },
  notesText: {
    fontSize: 10,
    color: "#4b5563",
    lineHeight: 1.5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 9,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
});

// Status color mapping
const getStatusColor = (status: keyof typeof statusThemes) => {
  return statusThemes[status] || statusThemes.draft;
};

// PDF Document Component
export const InvoicePDFDocument = ({ invoice }: { invoice: InvoiceType }) => {
  const statusColors = getStatusColor(invoice.status);
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoice.invoice_number}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.businessName}>{invoice.business_name}</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: statusColors.primary,
                  color: statusColors.text,
                  marginTop: 8,
                },
              ]}
            >
              <Text style={{ color: statusColors.text }}>{invoice.status}</Text>
            </View>
          </View>
        </View>

        {/* From and To Section */}
        <View style={styles.section}>
          <View style={styles.sectionColumn}>
            <Text style={styles.sectionTitle}>From</Text>
            <Text style={styles.infoBold}>{invoice.business_name}</Text>
          </View>
          <View style={[styles.sectionColumn, { alignItems: "flex-end" }]}>
            <Text style={styles.sectionTitle}>To</Text>
            <Text style={styles.infoBold}>{invoice.customer_name}</Text>
            {invoice.customer_phone && (
              <Text style={styles.infoText}>{invoice.customer_phone}</Text>
            )}
          </View>
        </View>

        {/* Invoice Details */}
        <View style={styles.section}>
          <View style={styles.sectionColumn}>
            <Text style={styles.sectionTitle}>Invoice Date</Text>
            <Text style={styles.infoText}>
              {formatDate(invoice.created_at)}
            </Text>
          </View>
          <View style={[styles.sectionColumn, { alignItems: "flex-end" }]}>
            <Text style={styles.sectionTitle}>Due Date</Text>
            <Text style={styles.infoText}>{formatDate(invoice.due_date)}</Text>
          </View>
        </View>

        {/* Line Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colDescription]}>
              Description
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colQuantity]}>
              Qty
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>
              Unit Price
            </Text>
            <Text style={[styles.tableHeaderCell, styles.colAmount]}>
              Amount
            </Text>
          </View>

          {invoice.line_items.map((item, index) => (
            <View key={index} style={styles.tableRow} wrap={false}>
              <View style={styles.colDescription}>
                <Text
                  style={[
                    styles.tableCell,
                    { fontWeight: "bold", marginBottom: 2 },
                  ]}
                >
                  {item.product_name}
                </Text>
                {item.description && (
                  <Text
                    style={[
                      styles.tableCell,
                      { fontSize: 9, color: "#6b7280" },
                    ]}
                  >
                    {item.description}
                  </Text>
                )}
              </View>
              <Text style={[styles.tableCell, styles.colQuantity]}>
                {item.quantity}
              </Text>
              <Text style={[styles.tableCell, styles.colPrice]}>
                KES {item.unit_price.toLocaleString()}
              </Text>
              <Text style={[styles.tableCell, styles.colAmount]}>
                KES {item.transaction_value.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal:</Text>
            <Text style={styles.totalsValue}>
              KES {invoice.total_amount.toLocaleString()}
            </Text>
          </View>
          <View style={styles.totalsFinalRow}>
            <Text style={[styles.totalsLabel, styles.totalsFinal]}>Total:</Text>
            <Text style={[styles.totalsValue, styles.totalsFinal]}>
              KES {invoice.total_amount.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Notes</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Generated on {new Date().toLocaleDateString()} • Thank you for your
            business
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// Main Component with Download Handler
export default function InvoicePDFGenerator() {
  const currentInvoice = useInvoiceStore((state) => state.currentInvoice);

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Invoice Preview
              </h1>
              <p className="text-gray-600">
                Click the button below to download the PDF invoice
              </p>
            </div>
            <button
              onClick={() => handleDownload(currentInvoice!)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>

          {/* Invoice Preview */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  INVOICE
                </h2>
                <p className="text-gray-600">
                  {currentInvoice?.invoice_number}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {currentInvoice?.business_name}
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
                    currentInvoice?.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : currentInvoice?.status === "draft"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {currentInvoice?.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">FROM</p>
                <p className="font-bold text-gray-900">
                  {currentInvoice?.business_name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-600 mb-2">TO</p>
                <p className="font-bold text-gray-900">
                  {currentInvoice?.customer_name}
                </p>
                <p className="text-sm text-gray-600">
                  {currentInvoice?.customer_phone}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-2 text-sm font-semibold text-gray-700">
                        Description
                      </th>
                      <th className="text-center py-2 text-sm font-semibold text-gray-700">
                        Qty
                      </th>
                      <th className="text-right py-2 text-sm font-semibold text-gray-700">
                        Unit Price
                      </th>
                      <th className="text-right py-2 text-sm font-semibold text-gray-700">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInvoice?.line_items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-3">
                          <p className="font-medium text-gray-900">
                            {item.product_name}
                          </p>
                          {item.description && (
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                          )}
                        </td>
                        <td className="text-center py-3 text-gray-700">
                          {item.quantity}
                        </td>
                        <td className="text-right py-3 text-gray-700">
                          KES {item.unit_price.toLocaleString()}
                        </td>
                        <td className="text-right py-3 font-semibold text-gray-900">
                          KES {item.transaction_value.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end mb-6">
              <div className="w-64">
                <div className="flex justify-between py-2 border-t-2 border-gray-900">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span className="font-bold text-gray-900">
                    KES {currentInvoice?.total_amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {currentInvoice?.notes && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="font-semibold text-gray-900 mb-1">Notes</p>
                <p className="text-sm text-gray-700">{currentInvoice?.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

