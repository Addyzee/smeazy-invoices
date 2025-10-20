import { CheckCircle, Trash } from "lucide-react";

interface DefaultButtonProps {
  onClick: () => void;
  buttonText: string;
  className?: string;
  Icon?: React.ComponentType<{ className?: string }>;
}

export function GenericButton({
  onClick,
  buttonText,
  className,
}: DefaultButtonProps) {
  return (
    <button
      onClick={onClick}
      className={
        className
          ? className
          : "py-4 px-8 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3 shadow-lg"
      }
    >
      <span>{buttonText}</span>
    </button>
  );
}

export function DeleteButton({
  onClick,
  buttonText,
  className,
}: DefaultButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`py-4 px-8 bg-gradient-to-r  text-white rounded-2xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3 shadow-lg ${className}`}
    >
      <Trash className="w-5 h-5" />
      <span>{buttonText}</span>
    </button>
  );
}

export function CancelButton({ onClick, buttonText }: DefaultButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 w-full sm:w-auto sm:px-8 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 text-sm sm:text-base"
    >
      {buttonText}
    </button>
  );
}

export function SubmitButton({ onClick, buttonText }: DefaultButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 w-full sm:flex-auto py-3 px-6 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
    >
      <span>{buttonText}</span>
      <CheckCircle className="w-4 h-4" />
    </button>
  );
}
