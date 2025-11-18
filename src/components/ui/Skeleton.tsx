import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
}

export const Skeleton = ({ className, count = 1, ...props }: SkeletonProps) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn("bg-muted rounded-md animate-pulse h-12", className)}
          {...props}
        />
      ))}
    </div>
  );
};
