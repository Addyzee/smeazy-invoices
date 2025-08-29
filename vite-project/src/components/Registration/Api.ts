import type { LoginFormType, RegisterBusinessFormType } from "./formSchemas";



const baseURL = import.meta.env.VITE_SERVER_URL;

export const registerBusinessAPI = async (registrationData: RegisterBusinessFormType) => {
  const url = `${baseURL}/users/business/register`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 400) {
        throw new Error(`Server error: ${errorData.error || "Bad Request"}`);
      } else if (response.status === 409) {
        throw new Error(
          `Conflict: ${errorData.error["Conflict"] || "Email already registered"}`,
        );
      } else {
        throw new Error(
          `Unexpected error: ${errorData.error || "Something went wrong"}`,
        );
      }
    }
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unknown error: ${String(error)}`);
  }
};

export const loginAPI = async ({ phone_number, password }: LoginFormType) => {
  const url = `${baseURL}/users/login`;
  // console.log(email, password);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone_number, password }),
      // body: JSON.stringify({ email: testAcc, password: testPass }), // tests
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Email or password incorrect");
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unknown error: ${String(error)}`);
  }
};


let isRefreshing = false;
let refreshPromise: Promise<Response> | null = null;

export const authFetch = async (url: string, options: RequestInit = {}) => {
  const tryRequest = async (token: string): Promise<Response> => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(baseURL + url, {
      ...options,
      headers,
    });

    // If unauthorized, try to refresh
    if (response.status === 401 && localStorage.getItem("refresh")) {
      // Try to refresh only once
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshTokenAPI();
      }

      try {
        const refreshResponse = await refreshPromise;
        isRefreshing = false;

        if (!refreshResponse || !refreshResponse.ok) {
          throw new Error("Refresh token invalid");
        }

        const newTokenData: { access: string; refresh: string } =
          await refreshResponse.json();

        if (!newTokenData?.access || !newTokenData?.refresh) {
          throw new Error("Incomplete token data");
        }

        localStorage.setItem("access", newTokenData.access);
        localStorage.setItem("refresh", newTokenData.refresh);

        // Retry the original request with new token
        const retryHeaders = {
          ...options.headers,
          Authorization: `Bearer ${newTokenData.access}`,
        };

        return await fetch(baseURL + url, {
          ...options,
          headers: retryHeaders,
        });

      } catch (err) {
        isRefreshing = false;
        await logoutAPI(); // Only logout if refresh fails
        throw err;
      }
    }

    return response;
  };

  const token = localStorage.getItem("access");
  if (!token) {
    await logoutAPI();
    throw new Error("No access token found");
  }

  return tryRequest(token);
};


export const refreshTokenAPI = async () => {
  const url = `${baseURL}/user/token/refresh/`;

  const refresh = localStorage.getItem("refresh");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unknown error: ${String(error)}`);
  }
};

export const logoutAPI = async () => {
  const url = `${baseURL}/user/logout/`;
  const refresh = localStorage.getItem("refresh");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });
    window.location.href = "/"; 
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    
    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unknown error: ${String(error)}`);
  }
};


export type LineItemType = {
  product_name: string;
  unit_price: number;
  quantity: number;
};

export type InvoiceCustomerType = {
  name: string;
  phone_number: string;
};

export type InvoiceCreateType = {
  business_id: number;
  total_amount: number;
  customer: InvoiceCustomerType;
  line_items: LineItemType[];
};

export const createInvoiceWithCustomerAPI = async (
  invoice: InvoiceCreateType
) => {
  const url = `${baseURL}/invoices/with-customer`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoice),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unknown error: ${String(error)}`);
  }
};
