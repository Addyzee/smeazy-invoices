import { AlertCircle, CheckCircle, DollarSign, TrendingDown } from "lucide-react";
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
    overdue: invoices.filter((inv) => new Date(inv.due_date) < new Date() && inv.status !== "paid").length,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Total Revenue"
        value={stats.totalRevenue}
        icon={DollarSign}
        color="blue"
        trend="positive"
      />
      <StatCard
        title="Paid Amount"
        value={stats.paid}
        icon={CheckCircle}
        color="green"
      />
      <StatCard
        title="Overdue Invoices"
        value={stats.overdue}
        icon={AlertCircle}
        color="red"
        isCount
      />
      <StatCard
        title="Total Expenditure"
        value={stats.totalExpenditure}
        icon={TrendingDown}
        color="purple"
      />
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: "blue" | "green" | "red" | "purple";
  trend?: "positive" | "negative";
  isCount?: boolean;
}> = ({ title, value, icon: Icon, color, trend, isCount = false }) => {
  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      gradient: "from-blue-500 to-blue-600",
      border: "border-blue-100"
    },
    green: {
      bg: "bg-green-50",
      icon: "text-green-600",
      gradient: "from-green-500 to-green-600",
      border: "border-green-100"
    },
    red: {
      bg: "bg-red-50",
      icon: "text-red-600",
      gradient: "from-red-500 to-red-600",
      border: "border-red-100"
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      gradient: "from-purple-500 to-purple-600",
      border: "border-purple-100"
    }
  };

  const colors = colorClasses[color];
  const formattedValue = isCount 
    ? value.toString() 
    : `KES ${value.toLocaleString()}`;

  return (
    <div className={`relative bg-white rounded-xl shadow-sm border ${colors.border} p-5 sm:p-6 hover:shadow-md transition-all duration-200 group overflow-hidden`}>
      {/* Subtle background pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <div className={`w-full h-full bg-gradient-to-br ${colors.gradient} rounded-full blur-2xl`} />
      </div>

      <div className="relative">
        {/* Icon and Title Row */}
        <div className="flex items-start justify-between mb-4">
          <div className={`${colors.bg} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.icon}`} />
          </div>
          {trend && (
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              trend === "positive" 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}>
              {trend === "positive" ? "↑" : "↓"}
            </span>
          )}
        </div>

        {/* Value */}
        <div className="space-y-1">
          <p className={`text-2xl sm:text-3xl font-bold text-gray-900 ${!isCount && 'text-xl sm:text-2xl'}`}>
            {formattedValue}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};