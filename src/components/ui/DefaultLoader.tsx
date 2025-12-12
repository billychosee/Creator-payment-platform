import React from "react";
import { cn } from "@/lib/utils";

interface DefaultLoaderProps {
  /**
   * Size of the loader
   * @default "md"
   */
  size?: "sm" | "md" | "lg" | "xl";

  /**
   * Text to display below the spinner
   * @default "Loading..."
   */
  text?: string;

  /**
   * Type of loader to show
   * @default "spinner"
   */
  variant?: "spinner" | "dots" | "pulse" | "skeleton";

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Full screen loader (overlay)
   * @default false
   */
  fullScreen?: boolean;

  /**
   * Center the loader in container
   * @default true
   */
  center?: boolean;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const textSizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

export const DefaultLoader: React.FC<DefaultLoaderProps> = ({
  size = "md",
  text = "Loading...",
  variant = "spinner",
  className,
  fullScreen = false,
  center = true,
}) => {
  const renderSpinner = () => (
    <svg
      className={cn("animate-spin", sizeClasses[size])}
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
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "bg-current rounded-full animate-pulse",
            size === "sm"
              ? "h-2 w-2"
              : size === "md"
              ? "h-3 w-3"
              : size === "lg"
              ? "h-4 w-4"
              : "h-5 w-5"
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "1s",
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      className={cn("bg-current rounded-full animate-ping", sizeClasses[size])}
    />
  );

  const renderSkeleton = () => (
    <div className="space-y-3 w-full">
      {Array.from({ length: size === "sm" ? 2 : size === "lg" ? 6 : 4 }).map(
        (_, i) => (
          <div
            key={i}
            className={cn(
              "bg-muted rounded-md animate-pulse h-4",
              size === "sm" ? "h-3" : size === "lg" ? "h-6" : "h-4",
              className
            )}
          />
        )
      )}
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case "dots":
        return renderDots();
      case "pulse":
        return renderPulse();
      case "skeleton":
        return renderSkeleton();
      case "spinner":
      default:
        return renderSpinner();
    }
  };

  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-3",
        center && "text-center",
        fullScreen && "min-h-screen",
        className
      )}
    >
      {variant !== "skeleton" && renderLoader()}
      {text && variant !== "skeleton" && (
        <p className={cn("text-muted-foreground", textSizeClasses[size])}>
          {text}
        </p>
      )}
      {variant === "skeleton" && text && (
        <p
          className={cn(
            "text-muted-foreground font-medium",
            textSizeClasses[size]
          )}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

// Skeleton variants for different content types
export const CardSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="h-6 bg-muted rounded animate-pulse w-3/4" />
    <div className="space-y-2">
      <div className="h-4 bg-muted rounded animate-pulse" />
      <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
      <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
    </div>
    <div className="flex space-x-2">
      <div className="h-8 bg-muted rounded animate-pulse w-20" />
      <div className="h-8 bg-muted rounded animate-pulse w-20" />
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => (
  <div className="space-y-3">
    {/* Table header */}
    <div className="flex space-x-4">
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="h-4 bg-muted rounded animate-pulse flex-1" />
      ))}
    </div>
    {/* Table rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, j) => (
          <div key={j} className="h-4 bg-muted rounded animate-pulse flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const FormSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <div className="h-4 bg-muted rounded animate-pulse w-20" />
      <div className="h-10 bg-muted rounded animate-pulse" />
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-muted rounded animate-pulse w-32" />
      <div className="h-10 bg-muted rounded animate-pulse" />
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-muted rounded animate-pulse w-28" />
      <div className="h-10 bg-muted rounded animate-pulse" />
    </div>
    <div className="h-10 bg-muted rounded animate-pulse" />
  </div>
);

export default DefaultLoader;
