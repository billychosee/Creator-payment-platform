import type { Metadata } from "next";
import { ThemeProvider } from "./layout/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creator Payment Platform",
  description: "Monetize your influence. Accept payments from your community.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
