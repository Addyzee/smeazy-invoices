import React from "react";

interface Transaction {
  number: string;
  customer: string;
  total: number;
  date: string;
  status: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-4 py-2">Invoice #</th>
            <th className="px-4 py-2">Customer</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr
              key={index}
              className="border-b hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-4 py-2">{tx.number}</td>
              <td className="px-4 py-2">{tx.customer}</td>
              <td className="px-4 py-2 text-green-600 font-semibold">
                ${tx.total.toLocaleString()}
              </td>
              <td className="px-4 py-2">{tx.date}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    tx.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {tx.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;