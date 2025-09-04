import { type LoginFormType, type RegistrationFormType, type TokenType, type UserType } from "./types";

const baseURL = import.meta.env.VITE_SERVER_URL;

export const registerAPI = async (registrationData: RegistrationFormType): Promise<UserType> => {
  const url = `${baseURL}/users/register`;
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
        throw new Error(errorData.detail || "Bad Request");
      } else if (response.status === 409) {
        throw new Error(errorData.detail || "Conflict");
      } else {
        throw new Error(errorData.detail || "Something went wrong");
      }
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unknown error: ${String(error)}`);
  }
};


export const loginAPI = async ({ phone_number, password }: LoginFormType):Promise<TokenType> => {
  const url = `${baseURL}/users/token`;
  console.log("Base URL:", baseURL); // Debugging line
  console.log("Login API URL:", url); // Debugging line

  try {
    const formData = new URLSearchParams();
    formData.append("username", phone_number);
    formData.append("password", password);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Phone number or password incorrect");
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    }

    return response.json(); // parse token
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Unknown error: ${String(error)}`);
  }
};
