import { CheckCircle, Clock, FileText, Send,  XCircle } from "lucide-react";

export const statusThemes = {
  draft: {
    label: "Draft",
    color:
      "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300",
    primary: "from-gray-500 to-gray-600",
    secondary: "from-gray-100 to-gray-200",
    accent: "from-gray-50 to-gray-100",
    text: "text-gray-800",
    border: "border-gray-300",
    icon: FileText,
  },
  sent: {
    label: "Sent",
    color:
      "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300",
    primary: "from-blue-500 to-blue-600",
    secondary: "from-blue-100 to-blue-200",
    accent: "from-blue-50 to-blue-100",
    text: "text-blue-800",
    border: "border-blue-300",
    icon: Send,
  },
  received: {
    label: "Received",
    color:
      "bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 border-teal-300",
    primary: "from-teal-500 to-teal-600",
    secondary: "from-teal-100 to-teal-200",
    accent: "from-teal-50 to-teal-100",
    text: "text-teal-800",
    border: "border-teal-300",
    icon: CheckCircle,
  },
  paid: {
    label: "Paid",
    color:
      "bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border-green-300",
    primary: "from-green-500 to-emerald-600",
    secondary: "from-green-100 to-emerald-200",
    accent: "from-green-50 to-emerald-100",
    text: "text-green-800",
    border: "border-green-300",
    icon: CheckCircle,
  },
  overdue: {
    label: "Overdue",
    color:
      "bg-gradient-to-r from-orange-100 to-red-200 text-red-800 border-red-300",
    primary: "from-orange-500 to-red-600",
    secondary: "from-orange-100 to-red-200",
    accent: "from-orange-50 to-red-100",
    text: "text-red-800",
    border: "border-red-300",
    icon: Clock,
  },
  cancelled: {
    label: "Cancelled",
    color:
      "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300",
    primary: "from-red-500 to-red-600",
    secondary: "from-red-100 to-red-200",
    accent: "from-red-50 to-red-100",
    text: "text-red-800",
    border: "border-red-300",
    icon: XCircle,
  },
};
