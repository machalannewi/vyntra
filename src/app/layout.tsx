import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const inter = Inter_Tight({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Vyntra — International phone numbers",
  description: "Get US, UK, Canadian and other international phone numbers in minutes. Pay in naira.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <noscript>
          <style>{`.reveal{opacity:1!important;filter:none!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
