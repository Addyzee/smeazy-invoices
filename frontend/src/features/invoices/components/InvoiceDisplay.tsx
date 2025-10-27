import React, { useState, useEffect } from "react";
import {
  Receipt,
  Building2,
  User,
  Phone,
  Package,
  Calculator,
  Calendar,
  ArrowLeft,
  Download,
  Send,
  Edit,
  FileText,
  Hand,
} from "lucide-react";
import { useInvoiceStore } from "../store";
import { statusThemes } from "../ui/themes";
import { StatusBadge } from "../ui/components";
import { formatDate } from "../utils";
import { useDeleteInvoice } from "../hooks/useAPIs";
import type { InvoiceType } from "../types";
import { usePhoneNumber } from "../../../hooks/useData";
import { DeleteButton, GenericButton } from "../../../components/Buttons";
import FormattedNumber from "../ui/components";
import Markdown from "react-markdown";
import { handleDownload } from "../utils/handleDownload";

interface InvoiceDisplayProps {
  onDownload?: () => void;
  onSend?: () => void;
}

const ViewSection: React.FC<{
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  status?: keyof typeof statusThemes;
}> = ({ title, icon: Icon, children, status }) => {
  const theme = status ? statusThemes[status] : null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:bg-white/90 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`w-10 h-10 bg-gradient-to-r ${
            theme?.primary || "from-primary to-secondary"
          } rounded-xl flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
};

const InfoRow: React.FC<{
  label: string;
  value: string | number;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}> = ({ label, value, className = "", icon: Icon }) => {
  return (
    <div
      className={`${className} flex items-center justify-between py-4 border-b border-gray-100/50 last:border-b-0 group hover:bg-gray-50/50 rounded-lg px-2 -mx-2 transition-all duration-200`}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-200">
            <Icon className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors duration-200" />
          </div>
        )}
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <span className="text-sm text-gray-900 font-semibold">{value}</span>
    </div>
  );
};

const LineItemCard: React.FC<{
  item: InvoiceType["line_items"][0];
  index: number;
  status?: keyof typeof statusThemes;
}> = ({ item, index, status }) => {
  const theme = status ? statusThemes[status] : null;

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/30 shadow-md hover:shadow-lg hover:bg-white/80 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-8 h-8 bg-gradient-to-r ${
                theme?.primary || "from-primary to-secondary"
              } text-white rounded-xl flex items-center justify-center text-xs font-bold shadow-lg`}
            >
              {index + 1}
            </div>
            <h4 className="font-bold text-gray-900 text-lg">
              {item.product_name}
            </h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 max-sm:flex max-sm:flex-col mb-4">
        <div className="text-center">
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-3 mb-2">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
              Quantity
            </p>
            <p className="font-bold text-gray-900 text-lg">{item.quantity}</p>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-3 mb-2">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
              Unit Price
            </p>
            <p className="font-bold text-gray-900 text-lg">
              KES
              <FormattedNumber value={item.unit_price} />
            </p>
          </div>
        </div>
        <div className="text-center">
          <div
            className={`bg-gradient-to-r ${
              theme?.accent || "from-primary/10 to-secondary/10"
            } rounded-xl p-3 mb-2 border ${
              theme?.border || "border-primary/20"
            }`}
          >
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
              Total
            </p>
            <p
              className={`font-bold text-lg ${theme?.text || "text-gray-900"}`}
            >
              KES
              <FormattedNumber value={item.transaction_value} />
            </p>
          </div>
        </div>
      </div>
      <div>
        {item.description && (
          <div className="prose prose-sm max-w-none p-4 border border-gray-200 rounded-lg bg-gray-50 mt-2">
            <Markdown>{item.description}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

export const InvoiceDisplay: React.FC<InvoiceDisplayProps> = ({ onSend }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const invoice = useInvoiceStore(
    (state) => state.currentInvoice
  ) as unknown as InvoiceType;
  const setCurrentInvoice = useInvoiceStore((state) => state.setCurrentInvoice);
  const setPopUpType = useInvoiceStore((state) => state.setPopUpType);
  const phoneNumber = usePhoneNumber();
  const deleteInvoice = useDeleteInvoice();

  const theme = statusThemes[invoice.status];

  const onBack = () => {
    setPopUpType(null);
    setCurrentInvoice(null);
  };

  const onEdit = invoice.customer
    ? invoice.customer.phone_number &&
      invoice.customer?.phone_number != phoneNumber
      ? () => setPopUpType("update")
      : null
    : () => setPopUpType("update");
  const onDelete = () => {
    deleteInvoice.mutate();
    setPopUpType(null);
  };
  const onDownload = () => {
    handleDownload(invoice);
  };

  // Handle scroll for sticky header effect
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      setIsScrolled(target.scrollTop > 20);
    };

    const scrollContainer = document.querySelector(".invoice-scroll-container");
    scrollContainer?.addEventListener("scroll", handleScroll);

    return () => scrollContainer?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="invoice-scroll-container max-w-screen h-full w-full overflow-y-auto">
      {/* Glassmorphism background with animated gradient */}
      <div className={`min-h-full bg-gradient-to-br ${theme.accent} relative`}>
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-30">
          <div
            className={`absolute top-20 left-20 w-64 h-64 bg-gradient-to-r ${theme.primary} rounded-full blur-3xl opacity-20`}
          ></div>
          <div
            className={`absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r ${theme.secondary} rounded-full blur-3xl opacity-15`}
          ></div>
        </div>

        <div className="relative z-10 py-4 sm:py-8 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            {/* Sticky Header with glassmorphism - Compact on mobile */}
            <div
              className={`sticky top-0 z-20 transition-all duration-300 mb-6 sm:mb-8 ${
                isScrolled
                  ? "bg-white/80 backdrop-blur-md shadow-lg border border-white/20"
                  : "bg-white/60 backdrop-blur-sm shadow-md border border-white/10"
              } rounded-xl sm:rounded-2xl p-3 sm:p-6`}
            >
              {/* Navigation and Actions Row - Simplified on mobile */}
              <div className="flex items-center justify-between mb-3 sm:mb-6">
                <button
                  onClick={onBack}
                  className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:bg-white/60 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Back to Invoices</span>
                  <span className="sm:hidden">Back</span>
                </button>

                <div className="flex items-center gap-2 sm:gap-3">
                  {onDownload && (
                    <button
                      onClick={onDownload}
                      className="p-2 sm:py-2 sm:px-4 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl text-gray-700 font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg border border-white/30"
                      title="Download"
                    >
                      <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline text-sm">Download</span>
                    </button>
                  )}
                  {onSend && (
                    <button
                      onClick={onSend}
                      className={`p-2 sm:py-2 sm:px-4 bg-gradient-to-r ${theme.primary} text-white rounded-lg sm:rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center gap-2`}
                      title="Send"
                    >
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline text-sm">Send</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Invoice Header - Stacked on mobile, side-by-side on desktop */}
              <div className="space-y-3 sm:space-y-0 sm:flex sm:items-start sm:justify-between sm:gap-4">
                {/* Left side - Invoice info */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${theme.primary} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0`}
                  >
                    <Receipt className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h1 className="text-xl sm:text-3xl font-bold text-gray-900 truncate">
                        {invoice.invoice_number}
                      </h1>
                      <StatusBadge status={invoice.status} />
                    </div>
                    <p className="text-sm sm:text-lg text-gray-600 font-medium truncate">
                      {invoice.business_name}
                    </p>
                  </div>
                </div>

                {/* Right side - Total amount - Full width on mobile */}
                <div className="sm:text-right w-full sm:w-auto">
                  <div
                    className={`bg-gradient-to-r ${theme.accent} rounded-xl sm:rounded-2xl p-3 sm:p-4 border ${theme.border} shadow-lg`}
                  >
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-0.5 sm:mb-1">
                      Total Amount
                    </p>
                    <p className={`text-2xl sm:text-3xl font-bold ${theme.text}`}>
                      KES <FormattedNumber value={invoice.total_amount} />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Information Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Business Information */}
              <ViewSection
                title="Business Information"
                icon={Building2}
                status={invoice.status}
              >
                <InfoRow
                  label="Business Name"
                  value={invoice.business_name}
                  icon={Building2}
                />
              </ViewSection>

              {/* Customer Information */}
              <ViewSection
                title="Customer Information"
                icon={User}
                status={invoice.status}
              >
                <InfoRow
                  label="Full Name"
                  value={invoice.customer_name}
                  icon={User}
                />
                {invoice.customer_phone && (
                  <InfoRow
                    label="Phone Number"
                    value={invoice.customer_phone}
                    icon={Phone}
                  />
                )}
              </ViewSection>
            </div>

            {/* Invoice Details Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <ViewSection
                title="Invoice Details"
                icon={Calendar}
                status={invoice.status}
              >
                <InfoRow
                  label="Invoice #"
                  value={invoice.invoice_number}
                  icon={Receipt}
                />
                <InfoRow
                  label="Date created"
                  value={formatDate(invoice.created_at)}
                  icon={Calendar}
                />
                {invoice.due_date && (
                  <InfoRow
                    label="Due Date"
                    value={formatDate(invoice.due_date)}
                    icon={Calendar}
                  />
                )}
              </ViewSection>

              {/* Summary Section */}
              <ViewSection
                title="Summary"
                icon={Calculator}
                status={invoice.status}
              >
                <div
                  className={`bg-gradient-to-r ${theme.accent} rounded-xl p-5 border ${theme.border} shadow-inner`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-700">
                      Status
                    </span>
                    <StatusBadge status={invoice.status} />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-700">
                      Total Items
                    </span>
                    <div
                      className={`bg-gradient-to-r ${theme.secondary} rounded-lg px-3 py-1`}
                    >
                      <span className={`font-bold ${theme.text}`}>
                        {invoice.line_items.length}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      Average Item Value
                    </span>
                    <span className={`font-bold ${theme.text}`}>
                      KES{" "}
                      <FormattedNumber
                        value={
                          invoice.total_amount /
                          invoice.line_items.reduce(
                            (acc, item) => acc + item.quantity,
                            0
                          )
                        }
                      />
                    </span>
                  </div>
                </div>
              </ViewSection>
            </div>

            {/* Line Items */}
            <ViewSection
              title="Invoice Items"
              icon={invoice.line_items[0]?.type === "product" ? Package : Hand}
              status={invoice.status}
            >
              <div className="space-y-6">
                {invoice.line_items.map((item, index) => (
                  <LineItemCard
                    key={`${item.product_name}-${index}`}
                    item={item}
                    index={index}
                    status={invoice.status}
                  />
                ))}

                {/*  Total Summary */}
                <div
                  className={`bg-gradient-to-r ${theme.accent} rounded-2xl p-8 border-2 ${theme.border} shadow-xl mt-8 relative overflow-hidden`}
                >
                  {/* Decorative background element */}
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-r ${theme.primary} rounded-full blur-2xl opacity-20 transform translate-x-16 -translate-y-16`}
                  ></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-16 h-16 bg-gradient-to-r ${theme.primary} rounded-2xl flex items-center justify-center shadow-xl`}
                        >
                          <Calculator className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-1">
                            Grand Total
                          </p>
                          <p className={`text-3xl font-bold ${theme.text}`}>
                            KES {invoice.total_amount.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Additional total info */}
                      <div className="text-right">
                        <div
                          className={`bg-gradient-to-r ${theme.secondary} rounded-xl p-3`}
                        >
                          <p className="text-xs font-medium text-gray-600 mb-1">
                            Items
                          </p>
                          <p className={`text-xl font-bold ${theme.text}`}>
                            {invoice.line_items.length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ViewSection>

            {invoice.notes && (
              <div className="mt-8">
                <ViewSection
                  title="Additional Notes"
                  icon={FileText}
                  status={invoice.status}
                >
                  <div
                    className={`bg-gradient-to-r ${theme.accent} rounded-xl p-6 border ${theme.border} shadow-inner`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 bg-gradient-to-r ${theme.secondary} rounded-lg flex items-center justify-center flex-shrink-0 mt-1`}
                      >
                        <FileText className={`w-4 h-4 ${theme.text}`} />
                      </div>
                      <p className="text-gray-800 leading-relaxed font-medium">
                        {invoice.notes}
                      </p>
                    </div>
                  </div>
                </ViewSection>
              </div>
            )}

            {/* Enhanced Action Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <GenericButton
                onClick={onBack}
                buttonText="Back to Invoices"
                className="py-4 px-8 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-2xl text-gray-700 font-semibold transition-all duration-200 flex items-center justify-center gap-3 hover:cursor-pointer shadow-lg hover:shadow-xl border border-white/30"
                Icon={ArrowLeft}
              />

              {onEdit && (
                <GenericButton
                  onClick={onEdit}
                  buttonText="Edit Invoice"
                  className={`py-4 px-8 bg-gradient-to-r ${theme.primary} text-white rounded-2xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3 shadow-lg`}
                  Icon={Edit}
                />
              )}
              {onDownload && (
                <GenericButton
                  onClick={onDownload}
                  buttonText="Download Invoice"
                  className="py-4 px-8 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-2xl text-gray-700 font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:cursor-pointer hover:shadow-xl border border-white/30"
                  Icon={Download}
                />
              )}
              {invoice.status === "cancelled" && (
                <DeleteButton
                  onClick={onDelete}
                  buttonText="Delete Invoice"
                  className={`${theme.primary}`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
