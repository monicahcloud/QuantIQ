import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://quantiqlearning.com"),

  title: {
    default: "QuantIQ Learning | AI-Powered Education Platform",
    template: "%s | QuantIQ Learning",
  },

  description:
    "QuantIQ Learning supports students, educators, schools, and districts through personalized learning, AI-powered lesson planning, assessments, academic intervention, and data-driven insights.",

  applicationName: "QuantIQ Learning",

  keywords: [
    "QuantIQ Learning",
    "QuantIQ Learning Institute",
    "QuantIQ Academy",
    "QuantIQ Educator Studio",
    "AI lesson planner",
    "teacher resources",
    "education technology",
    "personalized learning",
    "student intervention",
    "learning analytics",
    "curriculum planning",
    "education Bahamas",
  ],

  authors: [{ name: "Monicah Cloud" }],
  creator: "Monicah Cloud",
  publisher: "QuantIQ Learning",

  alternates: {
    canonical: "https://quantiqlearning.com",
  },

  openGraph: {
    type: "website",
    locale: "en_BS",
    url: "https://quantiqlearning.com",
    siteName: "QuantIQ Learning",
    title: "QuantIQ Learning | AI-Powered Education Platform",
    description:
      "Personalized learning and intelligent teaching tools for students, educators, schools, and districts.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "QuantIQ Learning",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "QuantIQ Learning",
    description:
      "AI-powered tools and personalized support for modern educators and learners.",
    images: ["/images/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en-BS"
        className={cn("h-full scroll-smooth antialiased", inter.variable)}>
        <body className="min-h-full bg-white font-sans text-slate-950">
          <div className="flex min-h-screen flex-col">{children}</div>

          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
