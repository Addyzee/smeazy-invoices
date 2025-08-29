import React from "react";
import { AuthSelector, LoginForm, RegistrationForm } from "./AuthForms";

export const AuthPage = () => {
  const [selectedAction, setSelectedAction] = React.useState<
    "login" | "register" | null
  >(null);

  const handleActionSelect = (action: "login" | "register") => {
    setSelectedAction(action);
  };

  const goBack = () => {
    setSelectedAction(null);
  };

  if (!selectedAction) {
    return <AuthSelector onActionSelect={handleActionSelect} />;
  }
  if (selectedAction === "register") {
    return <RegistrationForm onBack={goBack} />;
  }
  if (selectedAction === "login") {
    return <LoginForm onBack={goBack} />;
  }
};