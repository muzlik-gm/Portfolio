import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WebVitals } from "@/components/performance";
import { PersonStructuredData, WebsiteStructuredData } from "@/components/seo/StructuredData";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://muzlik.vercel.app'),
  title: {
    default: "Hamza - Developer Portfolio",
    template: "%s | Hamza"
  },
  description: "Full-stack developer specializing in web and game development. Check out my projects and get in touch.",
  keywords: ["developer", "portfolio", "web developer", "game developer", "React", "Next.js", "TypeScript"],
  authors: [{ name: "Hamza" }],
  creator: "Hamza",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Hamza - Developer Portfolio",
    description: "Full-stack developer specializing in web and game development",
    siteName: "Hamza Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hamza - Developer Portfolio",
    description: "Full-stack developer specializing in web and game development",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'Cs09EJwEBGMA3GV1P_UQhIGcKe3O5ozXdMuKl5srI-U',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: ['/favicon.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <PersonStructuredData />
        <WebsiteStructuredData />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <WebVitals />
        {children}
      </body>
    </html>
  );
}
