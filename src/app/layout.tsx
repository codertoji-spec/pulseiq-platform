import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "PulseIQ – Real-Time Event Analytics",
  description:
    "Production-grade real-time analytics platform for monitoring application events at scale.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="animated-gradient min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
