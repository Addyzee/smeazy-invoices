import React from "react";
import type { LoginFormType, RegistrationFormType } from "../types";

export const FormContext = React.createContext<{
  formData: RegistrationFormType | LoginFormType;
  onInputChange: (field: string, value: string) => void;
} | null>(null);

export const useFormContext = () => {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormContextProvider");
  }
  return context;
};



