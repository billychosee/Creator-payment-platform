import React from "react";
import { cn } from "@/lib/utils";
import { buttons, semantic } from "@/lib/colors";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "premium" | "destructive" | "glass" | "gradient";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      disabled,
      fullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "font-medium transition-all duration-300 flex items-center justify-center gap-2";

    const variants = {
      primary: `${buttons.primary} text-white active:scale-95 shadow-lg hover:shadow-xl`,
      secondary: `${buttons.secondary} text-white active:scale-95 shadow-lg hover:shadow-xl`,
      accent: `${buttons.accent} text-white active:scale-95 shadow-lg hover:shadow-xl`,
      outline: `${buttons.outline} shadow-lg hover:shadow-xl`,
      ghost: `${buttons.ghost} shadow-lg hover:shadow-xl`,
      premium: `${buttons.premium} text-white active:scale-95 shadow-lg hover:shadow-xl`,
      destructive: `bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white active:scale-95 shadow-lg hover:shadow-xl`,
      glass: `backdrop-blur-sm border border-white/20 bg-gradient-to-br from-white/10 to-white/5 text-white hover:border-white/40 hover:shadow-xl hover:shadow-white/20 active:scale-95`,
      gradient: `bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white active:scale-95 shadow-lg hover:shadow-xl`,
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded-lg",
      md: "px-4 py-2 text-base rounded-lg",
      lg: "px-6 py-3 text-lg rounded-xl",
      xl: "px-8 py-4 text-xl rounded-2xl",
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          widthClass,
          className,
          {
            "opacity-50 cursor-not-allowed": disabled || isLoading,
          }
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

