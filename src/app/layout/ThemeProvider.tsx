"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      // Only run on client side
      if (typeof window === 'undefined') return;
      
      // Check for saved theme in localStorage
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      
      // Check for system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      
      // Determine initial theme
      const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
      
      setTheme(initialTheme);
      
      // Apply theme to document
      const html = document.documentElement;
      if (initialTheme === "dark") {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
      
      setMounted(true);
    } catch (error) {
      console.error("Error initializing theme:", error);
      setTheme("light");
      setMounted(true);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    try {
      // Only run on client side
      if (typeof window === 'undefined') return;
      
      const html = document.documentElement;
      if (newTheme === "dark") {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
      localStorage.setItem("theme", newTheme);
    } catch (error) {
      console.error("Error applying theme:", error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  
  // During SSR or if context is not available, provide a safe fallback
  if (context === undefined) {
    return {
      theme: "light" as Theme,
      toggleTheme: () => {},
      mounted: false
    };
  }
  
  return context;
}

