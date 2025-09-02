import { useMutation } from "@tanstack/react-query";
import { loginAPI, registerAPI } from "../api";
import type { LoginFormType, RegistrationFormType } from "../types";
import { useLocation, useNavigate } from "react-router";
import { useUserDetailsStore } from "../../../store";

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
