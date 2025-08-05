import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientWrapper from "./component/ClientWrapper";
import { Metadata } from "next";
// import { Metadata } from "next";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "APE-MICROCREDIT",
  description: "The best microcredit app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="icon" href="/vercel.svg" sizes="32x32" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/vercel.svg" />
      </head>
        <ClientWrapper>{children}</ClientWrapper>
    </html>
  );
}
