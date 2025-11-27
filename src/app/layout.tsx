import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "./layout/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Tese - Monetize Your Influence",
    template: "%s | Tese"
  },
  description: "Accept payments from your community with ease. Get paid for your content, coaching, and collaborations. Just like Buy Me a Coffee, but for everyone.",
  keywords: ["creator payments", "monetize content", "community support", "digital payments", "creator economy"],
  authors: [{ name: "Tese Team" }],
  creator: "Tese",
  publisher: "Tese",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tese.com",
    title: "Tese - Monetize Your Influence",
    description: "Accept payments from your community with ease. Get paid for your content, coaching, and collaborations.",
    siteName: "Tese",
    images: [{
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "Tese - Monetize Your Influence"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tese - Monetize Your Influence",
    description: "Accept payments from your community with ease. Get paid for your content, coaching, and collaborations.",
    images: ["/og-image.jpg"]
  },
  icons: {
    icon: "/Tese-Icon.png",
    shortcut: "/Tese-Icon.png",
    apple: "/Tese-Icon.png"
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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

