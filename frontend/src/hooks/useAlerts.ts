import React from "react";

export const useAlert = () => {
  const [alert, setAlert] = React.useState<{
    type: 'error' | 'success';
    message: string;
  } | null>(null);

  const showError = (message: string) => {
    setAlert({ type: 'error', message });
  };

  const showSuccess = (message: string) => {
    setAlert({ type: 'success', message });
  };

  const dismiss = () => {
    setAlert(null);
  };

  return {
    alert,
    showError,
    showSuccess,
    dismiss
  };
};