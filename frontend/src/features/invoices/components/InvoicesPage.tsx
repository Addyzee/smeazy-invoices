import React, { useState } from "react";
import {
  Receipt,
  User,
  Calendar,
  Eye,
  Edit,
  Filter,
  Search,
  Plus,
  Download,
  Send,
  MoreVertical,
  Copy,
} from "lucide-react";
import type { InvoiceType, InvoiceWithType } from "../types";
import { useInvoiceStore } from "../store";
import { formatDate } from "../utils";
import { useClearAccessAndLogout } from "../../../hooks/useLogout";
import { InvoicesStats } from "./InvoiceStats";
import { useGetAllUserInvoices } from "../hooks/useAPIs";
import { StatusBadge } from "../ui/components";
import { useDistinguishInvoiceType } from "../hooks/useData";

// Main Invoice Grid Component
const InvoicesPage = () => {
  const { data } = useGetAllUserInvoices();
  const invoices = useDistinguishInvoiceType(data || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "status">("date");

  // Filter and sort invoices
  const filteredInvoices = invoices
    .filter((invoice) => {
      const matchesSearch =
        invoice.customer.full_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.invoice_number
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.business_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "amount":
          return b.total_amount - a.total_amount;
        case "status":
          return a.status.localeCompare(b.status);
        case "date":
        default:
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
      }
    });

  return (
    <div className="h-full w-full min-h-screen min-w-screen bg-gradient-to-br from-gray-50 to-primary/10 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <InvoicesPageHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalInvoices={filteredInvoices.length}
        />

        {/* Stats Cards */}
        <InvoicesStats invoices={invoices} />

        {/* Invoices Grid */}
        <InvoicesGrid invoices={filteredInvoices} />

        {filteredInvoices.length === 0 && (
          <EmptyState searchTerm={searchTerm} statusFilter={statusFilter} />
        )}
      </div>
    </div>
  );
};

// Header Component
interface InvoicesPageHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: "date" | "amount" | "status") => void;
  totalInvoices: number;
}

interface CreateInvoiceButtonInterface {
  text?: string;
}

const CreateInvoiceButton: React.FC<CreateInvoiceButtonInterface> = ({
  text = "New Invoice",
}) => {
  const setPopUpType = useInvoiceStore((state) => state.setPopUpType);
  const setCurrentInvoice = useInvoiceStore((state) => state.setCurrentInvoice);
  return (
    <button
      onClick={() => {
        setPopUpType("create");
        setCurrentInvoice(null);
      }}
      className="mt-4 sm:mt-0 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center gap-2 w-fit"
    >
      <Plus className="w-5 h-5" />
      <span>{text}</span>
    </button>
  );
};

const InvoicesPageHeader: React.FC<InvoicesPageHeaderProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  totalInvoices,
}) => {
  const { clearAccessAndLogout } = useClearAccessAndLogout();
  return (
    <div className="mb-8">
      {/* Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            SMEazy Invoices
          </h1>
          <p className="text-gray-600">
            {totalInvoices} {totalInvoices === 1 ? "invoice" : "invoices"} found
          </p>
        </div>
        <div className="flex gap-5">
          <button
            onClick={clearAccessAndLogout}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center gap-2"
          >
            <span>Logout</span>
          </button>
          <CreateInvoiceButton />
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) =>
                onSortChange(e.target.value as "date" | "amount" | "status")
              }
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

interface InvoicesGridProps {
  invoices: InvoiceWithType[];
}
const InvoicesGrid: React.FC<InvoicesGridProps> = ({ invoices }) => {
  const setPopUpType = useInvoiceStore((state) => state.setPopUpType);
  const setCurrentInvoice = useInvoiceStore((state) => state.setCurrentInvoice);

  const viewInvoice = (invoice: InvoiceType) => {
    setCurrentInvoice(invoice);
    setPopUpType("view");
  };
  const onEdit = (invoice: InvoiceType) => {
    setCurrentInvoice(invoice);
    setPopUpType("update");
  };
  const onDuplicate = (invoice: InvoiceType) => {
    setCurrentInvoice(invoice);
    setPopUpType("duplicate");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {invoices.map((invoice) => (
        <InvoiceCard
          key={invoice.invoice_number}
          invoice={invoice}
          onView={() => viewInvoice(invoice)}
          onEdit={() => onEdit(invoice)}
          onDownload={() =>
            console.log("Download invoice:", invoice.invoice_number)
          }
          onSend={() => console.log("Send invoice:", invoice.invoice_number)}
          onDuplicate={() => onDuplicate(invoice)}
        />
      ))}
    </div>
  );
};

interface InvoiceCardProps {
  invoice: InvoiceWithType;
  onView: () => void;
  onEdit?: () => void | undefined;
  onDownload: () => void;
  onSend?: () => void | undefined;
  onDuplicate: () => void;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoice,
  onView,
  onEdit = undefined,
  onDownload,
  onSend = undefined,
  onDuplicate,
}) => {
  const [showActions, setShowActions] = useState(false);
  const { editFunc, sendFunc } =
    invoice.type === "business"
      ? { editFunc: onEdit, sendFunc: onSend }
      : { editFunc: undefined, sendFunc: undefined };

  return (
    <div
      className={`group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 ${
        invoice.type === "personal" ? "bg-white/90 border-primary" : ""
      }`}
    >
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Receipt className="w-4 h-4 text-primary" />
              <span className="font-semibold text-gray-900">
                {invoice.invoice_number}
              </span>
            </div>
            <p className="text-sm text-gray-600">{invoice.business_name}</p>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={invoice.status} />
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>

              {showActions && (
                <ActionMenu
                  onView={onView}
                  onEdit={editFunc}
                  onDownload={onDownload}
                  onSend={sendFunc}
                  onDuplicate={onDuplicate}
                  setShowActions={setShowActions}
                />
              )}
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">
              {invoice.customer.full_name}
            </p>
            <p className="text-sm text-gray-600">
              {invoice.customer.phone_number}
            </p>
          </div>
        </div>

        {/* Amount */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Amount</span>
            <span className="text-xl font-bold text-gray-900">
              KES {invoice.total_amount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 mb-1">Created</p>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900">
                {formatDate(invoice.created_at)}
              </span>
            </div>
          </div>

          {invoice.due_date && (
            <div>
              <p className="text-gray-600 mb-1">Due Date</p>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">
                  {formatDate(invoice.due_date)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="px-6 pb-6">
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </button>

          {editFunc && (
            <button
              onClick={onEdit}
              className="flex-1 py-2 px-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 text-sm"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
          )}
        </div>
      </div>

      {/* Click overlay to close actions */}
      {showActions && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
};

interface ActionMenuProps {
  onView: () => void;
  onEdit?: (() => void) | undefined;
  onDownload: () => void;
  onSend?: (() => void) | undefined;
  onDuplicate: () => void;
  setShowActions: (show: boolean) => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  onView,
  onEdit = undefined,
  onDownload,
  onSend = undefined,
  onDuplicate,
  setShowActions,
}) => {
  return (
    <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[150px]">
      <ActionMenuItem
        icon={Eye}
        label="View"
        onClick={() => {
          onView();
          setShowActions(false);
        }}
      />
      {onEdit && (
        <ActionMenuItem
          icon={Edit}
          label="Edit"
          onClick={() => {
            onEdit();
            setShowActions(false);
          }}
        />
      )}
      <ActionMenuItem
        icon={Download}
        label="Download"
        onClick={() => {
          onDownload();
          setShowActions(false);
        }}
      />
      {onSend && (
        <ActionMenuItem
          icon={Send}
          label="Send"
          onClick={() => {
            onSend();
            setShowActions(false);
          }}
        />
      )}
      <ActionMenuItem
        icon={Copy}
        label="Duplicate"
        onClick={() => {
          onDuplicate();
          setShowActions(false);
        }}
      />
      <div className="border-t border-gray-100 my-1"></div>
    </div>
  );
};

const ActionMenuItem: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  danger?: boolean;
}> = ({ icon: Icon, label, onClick, danger }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm transition-colors duration-200 ${
        danger ? "text-red-600 hover:bg-red-50" : "text-gray-700"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
};

const EmptyState: React.FC<{ searchTerm: string; statusFilter: string }> = ({
  searchTerm,
  statusFilter,
}) => {
  const hasFilters = searchTerm || statusFilter !== "all";

  return (
    <div className="text-center py-16 flex flex-col justify-center items-center">
      <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 opacity-20">
        <Receipt className="w-12 h-12 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {hasFilters ? "No invoices found" : "No invoices yet"}
      </h3>
      <p className="text-gray-600 mb-6">
        {hasFilters
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Create your first invoice to get started."}
      </p>
      <CreateInvoiceButton text="Create Invoice" />
    </div>
  );
};

export default InvoicesPage;
