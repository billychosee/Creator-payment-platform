import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  position?: "center" | "bottom" | "top";
  contentClassName?: string;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "lg",
  position = "center",
  contentClassName,
}: ModalProps) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const positionClasses = {
    center: "top-1/2 -translate-y-1/2",
    bottom: "bottom-0",
    top: "top-0",
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        onClick={onClose}
        style={{
          top: -40,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh'
        }}
      />
      
      {/* Modal Content */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <div
          className={cn(
            "relative bg-background rounded-lg shadow-xl border border-border w-full mx-auto",
            "max-h-[90vh] overflow-hidden",
            sizeClasses[size],
            positionClasses[position]
          )}
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
        >
          <div className="max-h-[90vh] overflow-y-auto">
            {title && (
              <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 rounded-t-lg">
                <h2 className="text-lg font-semibold">{title}</h2>
              </div>
            )}
            <div className={cn("p-4", title && "pt-6", contentClassName)}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

