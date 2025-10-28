import { Document, Page, Text, View, Link } from "@react-pdf/renderer";
import type { InvoiceType } from "../types";
import {
  styles,
  getStatusColor,
  parseMarkdownDescription,
} from "../ui/pdfStyles";

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
                  width: "100px",
                },
              ]}
            ></View>
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
            <View key={index} wrap={false}>
              <View style={styles.tableRow}>
                <Text
                  style={[
                    styles.tableCell,
                    styles.colDescription,
                    { fontWeight: "bold" },
                  ]}
                >
                  {item.product_name}
                </Text>
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
              {item.description && (
                <View style={styles.descriptionRow}>
                  {parseMarkdownDescription(item.description, styles)}
                </View>
              )}
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
            Generated by{" "}
            <Link src="https://smeazy-invoices.vercel.app/">SMEazy</Link> •
            Thank you for your business
          </Text>
        </View>
      </Page>
    </Document>
  );
};
