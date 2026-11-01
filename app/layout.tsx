import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EventSense (Jashn) — GenAI Celebration Assistant",
  description:
    "An editorial, AI-powered celebration planning assistant for Indian weddings, milestone birthdays, and community festivals. Pure deterministic budgeting, privacy guardrails, and celebratory design.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`${fraunces.variable} ${instrumentSans.variable}`}>
      <body className="min-h-screen bg-parchment-50 font-sans text-ink antialiased selection:bg-marigold-200 selection:text-oxblood-900">
        <div className="relative min-h-screen flex flex-col bg-[radial-gradient(#e5dfd3_1px,transparent_1px)] [background-size:24px_24px]">
          {children}
        </div>
      </body>
    </html>
  );
}
