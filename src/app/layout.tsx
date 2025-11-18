import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "./layout/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CreatorPay - Monetize Your Influence",
    template: "%s | CreatorPay"
  },
  description: "Accept payments from your community with ease. Get paid for your content, coaching, and collaborations. Just like Buy Me a Coffee, but for everyone.",
  keywords: ["creator payments", "monetize content", "community support", "digital payments", "creator economy"],
  authors: [{ name: "CreatorPay Team" }],
  creator: "CreatorPay",
  publisher: "CreatorPay",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://creatorpay.com",
    title: "CreatorPay - Monetize Your Influence",
    description: "Accept payments from your community with ease. Get paid for your content, coaching, and collaborations.",
    siteName: "CreatorPay",
    images: [{
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "CreatorPay - Monetize Your Influence"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "CreatorPay - Monetize Your Influence",
    description: "Accept payments from your community with ease. Get paid for your content, coaching, and collaborations.",
    images: ["/og-image.jpg"]
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
