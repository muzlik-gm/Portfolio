import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WebVitals } from "@/components/performance";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hamza - Developer",
  description: "My portfolio - web dev, game dev, and whatever else I'm working on",
  keywords: ["developer", "portfolio", "web", "games"],
  authors: [{ name: "Hamza" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <WebVitals />
        {children}
      </body>
    </html>
  );
}
