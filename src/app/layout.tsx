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
    default: "SafeCode Agent",
    template: "%s · SafeCode Agent",
  },
  description:
    "Generate, isolate, observe, and repair Python inside an ephemeral Vercel Sandbox.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://safecode-agent.vercel.app",
  ),
  openGraph: {
    title: "SafeCode Agent",
    description:
      "A sandboxed, self-correcting Python execution system with evidence-rich traces.",
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
