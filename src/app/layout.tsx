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
    default: "Cross & Connect Waitlist",
    template: "%s | Cross & Connect"
  },
  description: "Join the waitlist for Cross & Connect. Be the first to know when we launch.",
  keywords: ["waitlist", "cross and connect", "signup"],
  authors: [{ name: "Cross & Connect" }],
  creator: "Cross & Connect",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://crossconnect.com",
    siteName: "Cross & Connect",
    title: "Cross & Connect Waitlist",
    description: "Join the waitlist for Cross & Connect. Be the first to know when we launch.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cross & Connect Waitlist",
    description: "Join the waitlist for Cross & Connect. Be the first to know when we launch.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
