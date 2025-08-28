// Dashboard.tsx
import StatsCard from "./StatsCard";
import TransactionsTable from "./TransactionsTable";
import RevenueChart from "./RevenueChart";
import { useEffect, useState } from "react";
import { fetchDashboardData } from "../../services/api";
import CreateInvoice from "./CreateInvoice";

interface DashboardData {
  revenue: number;
  users: number;
  pendingInvoices: number;
  revenueTrends: { month: string; revenue: number }[];
  transactions: { id: string; customer: string; amount: number; date: string; status: string }[];
}

const Dashboard: React.FC = () => {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboardData().then((res) => setData(res as DashboardData));
  }, []);

  if (!data) {
    return <p className="text-center mt-10 text-gray-500">Loading dashboard...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex">
      {/* Sidebar */}
      <aside className="fixed h-screen w-16 bg-white shadow-lg p-4 flex flex-col items-center space-y-6 z-40">
        <div className="text-blue-600">📊</div>
        <div className="text-gray-500">🏠</div>
        <div className="text-gray-500">📋</div>
        <div className="text-gray-500">👥</div>
        <div className="mt-auto text-gray-500">⚙️</div>
      </aside>

      {/* Main Content */}
      <div className="ml-16 p-6 flex-1">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <button 
            onClick={() => setShowInvoiceModal(true)} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Create an Invoice
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatsCard title="Total Revenue" value={`$${data.revenue.toLocaleString()}`} icon="💰" />
          <StatsCard title="Active Users" value={data.users.toLocaleString()} icon="👤" />
          <StatsCard title="Pending Invoices" value={data.pendingInvoices.toLocaleString()} icon="📝" />
          <StatsCard title="Average Paid Time" value="08 days" icon="⏳" />
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <RevenueChart data={data.revenueTrends} />
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Transactions</h2>
            <div className="flex space-x-2">
              <select className="border rounded-lg p-2 text-gray-600">
                <option>All Statuses</option>
                <option>Completed</option>
                <option>Pending</option>
              </select>
              <select className="border rounded-lg p-2 text-gray-600">
                <option>All Customers</option>
                <option>John Doe</option>
                <option>Jane Smith</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Apply Filters
              </button>
            </div>
          </div>
          <TransactionsTable
            transactions={data.transactions.map(t => ({
              status: t.status,
              date: t.date,
              number: t.id,
              customer: t.customer,
              total: t.amount,
            }))}
          />
        </div>

        {showInvoiceModal && <CreateInvoice onClose={() => setShowInvoiceModal(false)} />}
      </div>
    </div>
  );
};

export default Dashboard;