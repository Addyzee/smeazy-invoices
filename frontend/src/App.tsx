import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { AuthPage } from "./features/auth/components/AuthPage";
import InvoiceHome from "./features/invoices/components/Home";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const accessToken = localStorage.getItem("access_token");
  
  if (!accessToken) {
    return <Navigate to="/account" replace />;
  }
  
  return children;
};


const router = createBrowserRouter([
  {
    path: "/account",
    element: <AuthPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <InvoiceHome />
      </ProtectedRoute>
    ),
  },
]);

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-full w-full flex flex-col items-center justify-center">
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </div>
    </QueryClientProvider>
  );
}

export default App;
