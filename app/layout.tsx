import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import { Toaster } from "react-hot-toast";
import ConditionalHeader from "./components/conditionalHeader";
import Loading from "./components/loading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpinoSphere",
  description: "SpinoSphere is your ultimate hub for event bookings, offering seamless ticket purchases and event management.",
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
        <Loading />
        <Toaster />
        <ConditionalHeader />
        {children}
      </body>
    </html>
  );
}
