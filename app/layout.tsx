import type { Metadata } from "next";
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
  metadataBase: new URL("https://quantiqacademy.com"),
  title: {
    default:
      "QuantIQ Learning Institute | Individualized Learning Support in Nassau",
    template: "%s | QuantIQ Learning Institute",
  },
  description:
    "QuantIQ Learning Institute provides individualized learning support, academic intervention, assessments, executive functioning coaching, and student success programs in Nassau, Bahamas.",
  keywords: [
    "QuantIQ Learning Institute",
    "QuantIQ Academy",
    "learning support Nassau",
    "special education Bahamas",
    "academic intervention Nassau",
    "dyslexia support Bahamas",
    "ADHD support Nassau",
    "executive functioning coaching",
    "student assessments Bahamas",
    "IEP support Nassau",
  ],
  authors: [{ name: "Monicah Cloud" }],
  creator: "QuantIQ Learning Institute",
  publisher: "QuantIQ Learning Institute",
  openGraph: {
    title: "QuantIQ Learning Institute",
    description:
      "Built for the way students learn. Individualized learning support, intervention, assessments, and student success programs in Nassau, Bahamas.",
    url: "https://quantiqacademy.com",
    siteName: "QuantIQ Learning Institute",
    locale: "en_BS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuantIQ Learning Institute",
    description:
      "Individualized learning support and academic intervention for students who learn differently.",
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
    <html lang="en-BS" className={cn("h-full antialiased", inter.variable)}>
      <body className="min-h-full bg-white font-sans text-slate-950">
        <div className="flex min-h-screen flex-col">{children}</div>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
