import { Phone, User } from "lucide-react";
import React from "react";
import type { LoginFormType, RegistrationFormType } from "../types";
import {
  useSubmitLoginDetails,
  useSubmitRegistrationDetails,
} from "../hooks/useAPIs";
import {
  FormCard,
  InputField,
  PasswordField,
} from "../../../components/FormComponents";
import { useAlert } from "../../../hooks/useAlerts";
import { Alert } from "../../../components/Alerts";
import { useAuthStore } from "../store";

export const AuthForms = () => {
  const selectedAction = useAuthStore((state) => state.selectedAction);
  const { alert, dismiss, showSuccess, showError } = useAlert();

  return (
    <div className="h-full w-full overflow-y-scroll flex flex-col items-center justify-center">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onDismiss={dismiss}
          className="mb-4"
        />
      )}
      {selectedAction === "login" ? (
        <LoginForm showSuccess={showSuccess} showError={showError} />
      ) : selectedAction === "register" ? (
        <RegistrationForm showError={showError} showSuccess={showSuccess} />
      ) : null}
    </div>
  );
};

interface AuthFormProps {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

export const RegistrationForm = ({showSuccess, showError} : AuthFormProps) => {
  const setSelectedAction = useAuthStore((state) => state.setSelectedAction);
  const onBack = () => setSelectedAction(null);

  const [formData, setFormData] = React.useState<RegistrationFormType>({
    full_name: "",
    phone_number: "",
    password: "",
  });


  const submitRegistration = useSubmitRegistrationDetails({
    onSuccessActions: () => {
      showSuccess("Registration successful!");
      setSelectedAction("login");
    },
    onErrorActions: (error) => {
      showError(error.message);
    },
  });
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
      <FormCard
        title="Welcome"
        subtitle="Create Your Personal Account"
        submitButtonText="Create Account"
        onSubmit={() => {
          submitRegistration.mutate(formData);
        }}
        onBack={onBack}
        icon={User}
      >
        <InputField
          label="Full Name"
          type="text"
          value={(formData as RegistrationFormType).full_name}
          onChange={(value) => handleInputChange("full_name", value)}
          placeholder="Enter your full name"
          icon={User}
          required
        />
        <InputField
          label="Phone Number"
          type="tel"
          value={(formData as RegistrationFormType).phone_number}
          onChange={(value) => handleInputChange("phone_number", value)}
          placeholder="Enter your phone number"
          icon={Phone}
          required
        />
        <PasswordField
          label="Password"
          value={(formData as RegistrationFormType).password}
          onChange={(value) => handleInputChange("password", value)}
          placeholder="Enter your password"
          required
        />
      </FormCard>
  );
};

const LoginForm = ({showSuccess, showError}: AuthFormProps) => {
  const setSelectedAction = useAuthStore((state) => state.setSelectedAction);
  const onBack = () => setSelectedAction(null);
  const [formData, setFormData] = React.useState<LoginFormType>({
    phone_number: localStorage.getItem("phone_number")
      ? JSON.parse(localStorage.getItem("phone_number") || "")
      : "",
    password: "",
  });

  const submitLogin = useSubmitLoginDetails({
    onSuccessActions: () => {
      showSuccess("Login successful!");
    },
    onErrorActions: (error) => {
      showError(error.message);
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <FormCard
      title="Welcome Back"
      subtitle="Please log in to your account"
      submitButtonText="Login"
      onSubmit={() => {
        submitLogin.mutate(formData);
      }}
      onBack={onBack}
      icon={User}
    >
      <InputField
        label="Phone Number"
        type="tel"
        value={(formData as LoginFormType).phone_number}
        onChange={(value) => handleInputChange("phone_number", value)}
        placeholder="Enter your phone number"
        icon={Phone}
        required
      />
      <PasswordField
        label="Password"
        value={(formData as LoginFormType).password}
        onChange={(value) => handleInputChange("password", value)}
        placeholder="Enter your password"
        required
      />
    </FormCard>
  );
};
