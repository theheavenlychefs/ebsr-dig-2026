import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "DIG 2026 | Elohim's Bible Study Retreat",
  description:
    "The official homepage for DIG 2026, Elohim's Bible Study Retreat in Lagos, Nigeria.",
  openGraph: {
    title: "DIG 2026 | Elohim's Bible Study Retreat",
    description:
      "16–20 December 2026 in Lagos, Nigeria. Registration is free.",
    images: ["/assets/hero-background.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
