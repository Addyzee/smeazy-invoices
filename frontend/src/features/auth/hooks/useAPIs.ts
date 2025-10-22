import { useMutation } from "@tanstack/react-query";
import { loginAPI, registerAPI } from "../api";
import type { LoginFormType, RegistrationFormType } from "../types";
import { useLocation, useNavigate } from "react-router";
import { useUserDetailsStore } from "../../../store";
import { useMigrateGuestData } from "../../invoices/utils/guestStorage";

interface useSubmitAuthFormProps {
  onSuccessActions?: () => void;
  onErrorActions?: (error: Error) => void;
}

export const useSubmitLoginDetails = ({
  onSuccessActions,
  onErrorActions,
}: useSubmitAuthFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const { useGuestAccount, setUseGuestAccount } = useUserDetailsStore();
  const migrateGuestData = useMigrateGuestData();


  return useMutation({
    mutationFn: async (data: LoginFormType) => {
      const response = await loginAPI(data);
      return response;
    },
    onSuccess: (data, variables) => {
      localStorage.setItem("access_token", JSON.stringify(data.access_token));
      localStorage.setItem("username", JSON.stringify(data.username));
      localStorage.setItem(
        "phone_number",
        JSON.stringify(variables.phone_number)
      );
      if (useGuestAccount) {
        setUseGuestAccount(false);
        migrateGuestData();
      }
      onSuccessActions?.();
      navigate(from, { replace: true });
    },
    onError: (error) => {
      onErrorActions?.(error);
    },
  });
};

export const useSubmitRegistrationDetails = ({
  onSuccessActions,
  onErrorActions,
}: useSubmitAuthFormProps) => {
  const { setUserDetails } = useUserDetailsStore();
  return useMutation({
    mutationFn: async (data: RegistrationFormType) => {
      const response = await registerAPI(data);
      return response;
    },
    onSuccess: (data) => {
      localStorage.setItem("username", JSON.stringify(data.username));
      localStorage.setItem("phone_number", JSON.stringify(data.phone_number));
      setUserDetails(data);
      onSuccessActions?.();
    },
    onError: (error) => {
      onErrorActions?.(error);
    },
  });
};

export const useProceedWithGuestAccount = () => {
  // Not an API
  const { setUseGuestAccount } = useUserDetailsStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  return () => {
    setUseGuestAccount(true);
    navigate(from, { replace: true });
  };
};
