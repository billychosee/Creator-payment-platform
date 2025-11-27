import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "./layout/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
<<<<<<< HEAD
    default: "Tese - Monetize Your Influence",
    template: "%s | Tese"
  },
  description: "Accept payments from your community with ease. Get paid for your content, coaching, and collaborations. Just like Buy Me a Coffee, but for everyone.",
  keywords: ["creator payments", "monetize content", "community support", "digital payments", "creator economy"],
  authors: [{ name: "Tese Team" }],
  creator: "Tese",
  publisher: "Tese",
=======
    default: "CreatorPay - Monetize Your Influence",
    template: "%s | CreatorPay"
  },
  description: "Accept payments from your community with ease. Get paid for your content, coaching, and collaborations. Just like Buy Me a Coffee, but for everyone.",
  keywords: ["creator payments", "monetize content", "community support", "digital payments", "creator economy"],
  authors: [{ name: "CreatorPay Team" }],
  creator: "CreatorPay",
  publisher: "CreatorPay",
>>>>>>> 5437d3ba0ab258dcc647014b231c909f7294bd7d
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
<<<<<<< HEAD
    url: "https://tese.com",
    title: "Tese - Monetize Your Influence",
    description: "Accept payments from your community with ease. Get paid for your content, coaching, and collaborations.",
    siteName: "Tese",
=======
    url: "https://creatorpay.com",
    title: "CreatorPay - Monetize Your Influence",
    description: "Accept payments from your community with ease. Get paid for your content, coaching, and collaborations.",
    siteName: "CreatorPay",
>>>>>>> 5437d3ba0ab258dcc647014b231c909f7294bd7d
    images: [{
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
<<<<<<< HEAD
      alt: "Tese - Monetize Your Influence"
=======
      alt: "CreatorPay - Monetize Your Influence"
>>>>>>> 5437d3ba0ab258dcc647014b231c909f7294bd7d
    }]
  },
  twitter: {
    card: "summary_large_image",
<<<<<<< HEAD
    title: "Tese - Monetize Your Influence",
=======
    title: "CreatorPay - Monetize Your Influence",
>>>>>>> 5437d3ba0ab258dcc647014b231c909f7294bd7d
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
<<<<<<< HEAD
    icon: "/Tese-Icon.png",
    shortcut: "/Tese-Icon.png",
    apple: "/Tese-Icon.png",
=======
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
>>>>>>> 5437d3ba0ab258dcc647014b231c909f7294bd7d
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
