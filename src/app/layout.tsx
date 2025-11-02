import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WebVitals } from "@/components/performance";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap", // Optimize font loading
});

export const metadata: Metadata = {
  title: "Hamza - Web & Game Developer",
  description: "Portfolio of Hamza, a 17-year-old web and game developer from Pakistan. Showcasing innovative projects and creative solutions.",
  keywords: ["web developer", "game developer", "portfolio", "Pakistan", "React", "Next.js"],
  authors: [{ name: "Hamza" }],
  creator: "Hamza",
  openGraph: {
    title: "Hamza - Web & Game Developer",
    description: "Portfolio of Hamza, a 17-year-old web and game developer from Pakistan.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hamza - Web & Game Developer",
    description: "Portfolio of Hamza, a 17-year-old web and game developer from Pakistan.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
