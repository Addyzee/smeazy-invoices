import {
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Phone,
  User,
} from "lucide-react";
import React, { type PropsWithChildren } from "react";
import type { LoginFormType, RegistrationFormType } from "../types";
import { FormContextProvider } from "./providers";
import { useFormContext } from "./context";

interface FormProps {
  onBack: () => void;
}

export const RegistrationForm = ({ onBack }: FormProps) => {
  const [formData, setFormData] = React.useState({
    full_name: "",
    phone_number: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary/10 flex items-center justify-center p-4 sm:p-6">
      <FormCard
        formTitle="Welcome"
        formSubTitle="Create Your Personal Account"
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onBack={onBack}
      >
        <FormCard.FullName />
        <FormCard.PhoneNumber />
        <FormCard.Password />
      </FormCard>
    </div>
  );
};

export const LoginForm = ({ onBack }: FormProps) => {
  const [formData, setFormData] = React.useState({
    phone_number: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary/10 flex items-center justify-center p-4 sm:p-6">
      <FormCard
        formTitle="Welcome Back"
        formSubTitle="Please log in to your account"
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onBack={onBack}
      >
        <FormCard.PhoneNumber />
        <FormCard.Password />
      </FormCard>
    </div>
  );
};

// Auth Selection Component(select whether to login or register)
interface AuthSelectorProps {
  onActionSelect: (action: "login" | "register") => void;
}

export const AuthSelector: React.FC<AuthSelectorProps> = ({ onActionSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary/10 flex items-center justify-center p-4 sm:p-6">
      <div className="text-center w-full max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Join Our Platform
        </h1>
        <p className="text-gray-600 mb-8 sm:mb-12 text-base sm:text-lg px-4">
          Choose how you'd like to get started
        </p>

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center">
          <ActionCard
            title="Personal Account"
            subtitle="Simple invoices"
            description="Create and receive invoices"
            icon={User}
            onClick={() => onActionSelect("register")}
          />
        </div>
        <p className="mt-5">Already have an account?</p>
        <button
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
          onClick={() => onActionSelect("login")}
        >
          Login
        </button>
      </div>
    </div>
  );
};

interface ActionCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  subtitle,
  description,
  icon: Icon,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer transform transition-all duration-300 hover:scale-105 sm:hover:-translate-y-2 w-full max-w-xs mx-auto"
    >
      <div className="w-full h-72 sm:h-80 bg-white rounded-2xl shadow-xl border border-gray-100 group-hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <div
          className={`h-20 sm:h-24 bg-gradient-to-r from-secondary to-accent relative`}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            {title}
          </h3>
          <p
            className={`text-sm font-medium mb-3 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent`}
          >
            {subtitle}
          </p>
          <p className="text-gray-600 text-sm mb-4 sm:mb-6 leading-relaxed">
            {description}
          </p>

          <div
            className={`w-full py-2.5 sm:py-2 px-4 rounded-lg bg-gradient-to-r from-secondary to-accent text-white font-medium text-center transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base`}
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};


// Form Card Component
type FormCardPropsWithChildren = PropsWithChildren & {
  formTitle: string;
  formSubTitle: string;
  formData: RegistrationFormType | LoginFormType;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
};

const FormCard = ({
  formTitle,
  formSubTitle,
  formData,
  onInputChange,
  onSubmit,
  onBack,
  children,
}: FormCardPropsWithChildren) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <FormCardHeader icon={User} />

        {/* Form Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {formTitle}
            </h2>
            {formSubTitle && <p className="text-gray-600">{formSubTitle}</p>}
          </div>

          <form className="space-y-6" autoComplete="off">
            <FormContextProvider formData={formData} onInputChange={onInputChange}>
              {children}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-secondary to-accent text-white font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2`}
                  onSubmit={onSubmit}
                >
                  <span>Create Account</span>
                  <CheckCircle className="w-4 h-4" />
                </button>
              </div>
            </FormContextProvider>
          </form>
        </div>
      </div>
    </div>
  );
};

interface FormCardHeaderProps {
  icon: React.ComponentType<{ className?: string }>;
}

const FormCardHeader = ({ icon: Icon }: FormCardHeaderProps) => {
  return (
    <div className={`h-32 bg-gradient-to-r from-secondary to-accent relative`}>
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
      <div className="absolute -bottom-2 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>

      <div className="relative h-full flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-2">
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};



interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ComponentType<{ className?: string }>;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-warning-red">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 sm:pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50/50 hover:bg-white text-sm sm:text-base"
        />
      </div>
    </div>
  );
};

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-warning-red">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
          <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 sm:pl-11 pr-10 sm:pr-11 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-gray-50/50 hover:bg-white text-sm sm:text-base"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 z-10"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

FormCard.FullName = function FullNameField() {
  const { formData, onInputChange } = useFormContext();
  return (
    <InputField
      label="Full Name"
      type="text"
      value={(formData as RegistrationFormType).full_name}
      onChange={(value) => onInputChange("full_name", value)}
      placeholder="Enter your full name"
      icon={User}
      required
    />
  );
};

FormCard.PhoneNumber = function PhoneNumberField() {
  const { formData, onInputChange } = useFormContext();
  return (
    <InputField
      label="Phone Number"
      type="tel"
      value={formData.phone_number}
      onChange={(value) => onInputChange("phone_number", value)}
      placeholder="Enter your phone number"
      icon={Phone}
      required
    />
  );
};

FormCard.Password = function PasswordWrapper() {
  const { formData, onInputChange } = useFormContext();
  return (
    <PasswordField
      label="Password"
      value={formData.password}
      onChange={(value) => onInputChange("password", value)}
      placeholder="Input password"
      required
    />
  );
};

