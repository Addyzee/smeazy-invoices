import { AlertCircle, CheckCircle, DollarSign } from "lucide-react";
import type { InvoiceWithType } from "../types";

export const InvoicesStats: React.FC<{ invoices: InvoiceWithType[] }> = ({
  invoices,
}) => {
  const businessInvoices = invoices.filter((inv) => inv.type === "business");
  const personalInvoices = invoices.filter((inv) => inv.type === "personal");
  const stats = {
    totalRevenue: businessInvoices.reduce(
      (sum, inv) => sum + inv.total_amount,
      0
    ),
    totalExpenditure: personalInvoices.reduce(
      (sum, inv) => sum + inv.total_amount,
      0
    ),
    paid: invoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + inv.total_amount, 0),
    pending: invoices.filter((inv) => inv.status === "sent").length,
    overdue: invoices.filter((inv) => inv.status === "overdue").length,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Total Revenue"
        value={`KES ${stats.totalRevenue.toLocaleString()}`}
        icon={DollarSign}
        color="from-primary to-secondary"
      />
      <StatCard
        title="Paid Amount"
        value={`KES ${stats.paid.toLocaleString()}`}
        icon={CheckCircle}
        color="from-green-500 to-emerald-500"
      />
      <StatCard
        title="Overdue"
        value={stats.overdue.toString()}
        icon={AlertCircle}
        color="from-red-500 to-pink-500"
      />
      <StatCard
        title="Total Expenditure"
        value={`KES ${stats.totalExpenditure.toLocaleString()}`}
        icon={DollarSign}
        color="from-primary to-secondary"
      />
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}> = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div
          className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};
