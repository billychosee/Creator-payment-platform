import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
  children?: React.ReactNode;
}

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

const SelectContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
} | null>(null);

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      children,
      value,
      defaultValue,
      onValueChange,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue || "");
    const [isOpen, setIsOpen] = useState(false);

    const currentValue = value !== undefined ? value : internalValue;

    const handleValueChange = (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
      setIsOpen(false);
    };

    return (
      <SelectContext.Provider
        value={{
          value: currentValue,
          onValueChange: handleValueChange,
          isOpen,
          setIsOpen,
        }}
      >
        <div ref={ref} className="relative" {...props}>
          {children}
        </div>
      </SelectContext.Provider>
    );
  }
);

Select.displayName = "Select";

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  SelectTriggerProps
>(({ children, className, disabled, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("SelectTrigger must be used within a Select");
  }

  const { isOpen, setIsOpen } = context;

  return (
    <button
      ref={ref}
      className={cn(
        "flex items-center justify-between w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "hover:bg-accent",
        className
      )}
      disabled={disabled}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
      />
    </button>
  );
});

SelectTrigger.displayName = "SelectTrigger";

export const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ placeholder, children }, ref) => {
    const context = React.useContext(SelectContext);
    if (!context) {
      throw new Error("SelectValue must be used within a Select");
    }

    const { value } = context;

    return (
      <span ref={ref} className="text-foreground">
        {value ? children || value : placeholder}
      </span>
    );
  }
);

SelectValue.displayName = "SelectValue";

export const SelectContent = React.forwardRef<
  HTMLDivElement,
  SelectContentProps
>(({ children, className, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("SelectContent must be used within a Select");
  }

  const { isOpen, setIsOpen } = context;
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg",
        "max-h-60 overflow-auto",
        "animate-in fade-in-0 zoom-in-95",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

SelectContent.displayName = "SelectContent";

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, value, className, onClick, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    if (!context) {
      throw new Error("SelectItem must be used within a Select");
    }

    const { value: currentValue, onValueChange } = context;

    const handleClick = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      onValueChange(value);
      onClick?.(event);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between px-4 py-2 cursor-pointer text-foreground",
          "hover:bg-accent hover:text-accent-foreground",
          "transition-colors",
          currentValue === value && "bg-accent font-medium",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        <span>{children}</span>
        {currentValue === value && <Check className="h-4 w-4" />}
      </div>
    );
  }
);

SelectItem.displayName = "SelectItem";
