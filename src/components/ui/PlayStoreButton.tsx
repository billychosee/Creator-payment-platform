import React from "react";
import { cn } from "@/lib/utils";

interface PlayStoreButtonProps {
  /**
   * URL to the Google Play Store (placeholder for now)
   * @default "#"
   */
  url?: string;
  
  /**
   * Size of the button
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;
}

export const PlayStoreButton: React.FC<PlayStoreButtonProps> = ({
  url = "#",
  size = "md",
  className,
  disabled = false,
}) => {
  const sizes = {
    sm: "h-10 px-3 text-xs",
    md: "h-12 px-4 text-sm",
    lg: "h-14 px-6 text-base",
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-3 rounded-lg",
        "bg-black hover:bg-gray-800 text-white font-medium",
        "transition-all duration-200 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2",
        "border border-gray-700",
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      aria-label="Get it on Google Play"
    >
      {/* Google Play Icon */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
      </svg>
      
      <div className="flex flex-col items-start leading-tight">
        <span className="text-xs opacity-90">Get it on</span>
        <span className="font-semibold">Google Play</span>
      </div>
    </a>
  );
};

export default PlayStoreButton;