import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Preloader from "./components/Preloader";
import ScrollFX from "./components/ScrollFX";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Net Composure — Security telemetry for your app",
  description:
    "Send security events from your app to Net Composure and get vulnerabilities, misconfigurations, and threats surfaced as actionable findings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}>
        <Preloader />
        <ScrollFX />
        {children}
      </body>
    </html>
  );
}