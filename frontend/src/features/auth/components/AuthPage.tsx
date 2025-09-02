import { useAuthStore } from "../store";
import { AuthForms } from "./AuthForms";
import { AuthSelector } from "./AuthSelector";

export const AuthPage = () => {
  const selectedAction = useAuthStore((state) => state.selectedAction);


  if (selectedAction === "register" || selectedAction === "login") {
    return <AuthForms />;
  }

    if (!selectedAction) {
    return <AuthSelector />;
  }
};