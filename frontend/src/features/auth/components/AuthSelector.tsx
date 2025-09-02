import { ArrowRight, User } from "lucide-react";
import { useAuthStore } from "../store";



export const AuthSelector: React.FC = () => {
  const setSelectedAction = useAuthStore((state) => state.setSelectedAction);
  return (
    <div className="h-full w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="text-center w-full">
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
            onClick={() => setSelectedAction("register")}
          />
        </div>
        <p className="mt-5">Already have an account?</p>
        <button
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
          onClick={() => setSelectedAction("login")}
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