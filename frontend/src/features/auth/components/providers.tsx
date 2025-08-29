import type { LoginFormType, RegistrationFormType } from "../types";
import { FormContext } from "./context";

type FormFieldsProviderProps = {
  children: React.ReactNode;
  formData: RegistrationFormType | LoginFormType;
  onInputChange: (field: string, value: string) => void;
};

export const FormContextProvider = ({
  children,
  formData,
  onInputChange,
}: FormFieldsProviderProps) => {
  
  return (
    <FormContext.Provider value={{ formData, onInputChange }}>
      {children}
    </FormContext.Provider>
  );
};