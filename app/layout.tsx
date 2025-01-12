"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import Sidebar from "@/app/component/sidebar/Sidebar";
import NavbarComponent from "./component/navbar/Navbar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname();
  const showLayout = pathName === "/" ? false : true;
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {showLayout && (
          <div className="min-w-screen min-h-screen flex flex-row">
            <Sidebar />
            <div className="w-full h-full flex flex-col">
              <NavbarComponent />
              <div className="w-full h-full">
              {children}

              </div>
            </div>
          </div>
        )}

        {!showLayout && children}
      </body>
    </html>
  );
}
