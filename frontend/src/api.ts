import type { UserType } from "./features/auth/types";

const baseURL = import.meta.env.VITE_SERVER_URL;

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

    // If unauthorized, log out
    if (response.status === 401 || response.status === 403) {
      await logoutAPI();
    }

    return response;
  };
  const token = JSON.parse(localStorage.getItem("access_token") as string);
  if (!token) {
    await logoutAPI();
    throw new Error("No access token found");
  }

  return tryRequest(token);
};

export const getUserDetailsAPI = async (): Promise<UserType> => {
  const url = "/users/me";
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
    const data = await response.json()

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unknown error: ${String(error)}`);
  }
};

export const logoutAPI = async () => {
  window.location.href = "/";
  localStorage.removeItem("access_token");
};
