// src/services/api.ts

export const fetchDashboardData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        revenue: 12450,
        users: 380,
        pendingInvoices: 12,
        revenueTrends: [
          { month: "Jan", revenue: 3000 },
          { month: "Feb", revenue: 4000 },
          { month: "Mar", revenue: 5500 },
          { month: "Apr", revenue: 4900 },
        ],
        transactions: [
          { id: "TXN-001", customer: "John Doe", amount: 250, date: "2025-08-21", status: "Completed" },
          { id: "TXN-002", customer: "Jane Smith", amount: 180, date: "2025-08-22", status: "Pending" },
          { id: "TXN-003", customer: "Acme Corp", amount: 600, date: "2025-08-23", status: "Completed" },
        ],
      });
    }, 800);
  });
};

// Example of adding more endpoints later:
export const fetchUserProfile = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: "Edwin Kabue",
        role: "Admin",
        email: "edwin.k@example.com",
      });
    }, 500);
  });
};
