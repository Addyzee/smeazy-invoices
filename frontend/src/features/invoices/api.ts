import { authFetch } from "../../api";
import type { InvoiceCreate, InvoiceDelete, InvoiceType, InvoiceUpdate } from "./types";


export const getAllUserInvoicesAPI = async (
  username: string
): Promise<InvoiceType[]> => {
  const url = `/invoices/user/${username}`;
  try {
    const response = await authFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unknown error: ${String(error)}`);
  }
};

export const getUserBusinessInvoicesAPI = async (
  username: string
): Promise<InvoiceType[]> => {
  const url = `/invoices/business/${username}`;
  try {
    const response = await authFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unknown error: ${String(error)}`);
  }
};


export const getUserCustomerInvoicesAPI = async (
  username: string
): Promise<InvoiceType[]> => {
  const url = `/invoices/customer/${username}`;
  try {
    const response = await authFetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unknown error: ${String(error)}`);
  }
};


export const createInvoiceAPI = async (
  invoice: InvoiceCreate
): Promise<InvoiceType> => {
  const url = "/invoices/create";
  try {
    const response = await authFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoice),
    });
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unknown error: ${String(error)}`);
  }
};

export const updateInvoiceAPI = async (
  invoice: InvoiceUpdate,
  invoiceNumber: string
): Promise<InvoiceType> => {
  const url = `/invoices/edit/${invoiceNumber}`;
  try {
    const response = await authFetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoice),
    });
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unknown error: ${String(error)}`);
  }
};

export const deleteInvoiceAPI = async (
  invoiceNumber: string
): Promise<InvoiceDelete> => {
  const url = `/invoices/delete/${invoiceNumber}`;
  try {
    const response = await authFetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unknown error: ${String(error)}`);
  }
};
