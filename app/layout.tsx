import type { Metadata } from "next";
import { Inter, Poppins } from 'next/font/google';
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "MICROTEK - Inventory Management System",
  description: "Professional inventory management system for animal feed businesses. Track stock, manage transactions, and generate reports with ease.",
  keywords: "inventory management, stock tracking, business management, animal feed, microtek",
  authors: [{ name: "MICROTEK" }],
  creator: "MICROTEK",
  publisher: "MICROTEK",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3b82f6",
  generator: 'Next.js',
  applicationName: "MICROTEK Inventory System",
  referrer: "origin-when-cross-origin",
  colorScheme: "light",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://microtek-inventory.com",
    title: "MICROTEK - Inventory Management System",
    description: "Professional inventory management system for animal feed businesses",
    siteName: "MICROTEK Inventory System",
  },
  twitter: {
    card: "summary_large_image",
    title: "MICROTEK - Inventory Management System",
    description: "Professional inventory management system for animal feed businesses",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
