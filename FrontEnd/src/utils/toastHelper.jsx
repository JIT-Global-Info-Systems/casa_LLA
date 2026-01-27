import toast from "react-hot-toast";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import MESSAGES from "@/config/messages";

/**
 * Toast helper functions with standardized icons and styling
 */

export const showSuccess = (message, duration = 3000) => {
  return toast.success(message, {
    duration,
    icon: <Check className="w-5 h-5 text-green-500" />,
    style: {
      borderRadius: "8px",
      background: "#f0fdf4",
      color: "#166534",
      border: "1px solid #bbf7d0",
    },
  });
};

export const showError = (message, duration = 5000) => {
  return toast.error(message, {
    duration,
    icon: <AlertCircle className="w-5 h-5 text-red-500" />,
    style: {
      borderRadius: "8px",
      background: "#fef2f2",
      color: "#991b1b",
      border: "1px solid #fecaca",
    },
  });
};

export const showLoading = (message) => {
  return toast.loading(message, {
    style: {
      borderRadius: "8px",
      background: "#f3f4f6",
      color: "#374151",
      border: "1px solid #e5e7eb",
    },
  });
};

export const showInfo = (message, duration = 3000) => {
  return toast(message, {
    duration,
    icon: "ℹ️",
    style: {
      borderRadius: "8px",
      background: "#eff6ff",
      color: "#1e40af",
      border: "1px solid #bfdbfe",
    },
  });
};

/**
 * Dismiss a specific toast
 */
export const dismissToast = (toastId) => {
  if (toastId) toast.dismiss(toastId);
};

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = () => {
  toast.removeAll();
};

export default {
  showSuccess,
  showError,
  showLoading,
  showInfo,
  dismissToast,
  dismissAllToasts,
};
