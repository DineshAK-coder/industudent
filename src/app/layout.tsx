import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProofWork — Student project marketplace",
  description:
    "Attempt real company projects, get verified feedback, and discover pre-screened talent with ProofWork.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased text-slate-100`}>
      <body className="min-h-full bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
