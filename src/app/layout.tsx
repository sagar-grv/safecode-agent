import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kavach Sentinel · Proof Lab",
    template: "%s · Kavach Sentinel",
  },
  description:
    "Kavach Sentinel is a bounded cyber-reasoning proof lab for safe vulnerability remediation.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://safecode-agent.vercel.app",
  ),
  openGraph: {
    title: "Kavach Sentinel · Proof Lab",
    description:
      "A bounded cyber-reasoning proof lab with synthetic evidence and policy-gated remediation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
