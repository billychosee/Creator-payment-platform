import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ToastProps {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  onClose: (id: string) => void;
}

export const Toast = ({ id, type, message, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 3000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const typeClasses = {
    success:
      "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400",
    error: "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400",
    info: "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400",
    warning:
      "bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400",
  };

  return (
    <div
      className={cn(
        "px-4 py-3 rounded-lg border flex items-center justify-between gap-3 animate-slide-up",
        typeClasses[type]
      )}
    >
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="opacity-50 hover:opacity-100 transition-opacity"
      >
        <X size={16} />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
  return (
    <div className="fixed bottom-4 right-4 space-y-3 z-50 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "info"
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message, onClose: removeToast }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, showToast, removeToast };
};
