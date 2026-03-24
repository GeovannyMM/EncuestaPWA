import type { Metadata, Viewport } from "next";
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

// 1. Conexión de la PWA con el navegador y llaves de iPhone
export const metadata: Metadata = {
  title: "Encuesta Alfabetismo",
  description: "PWA Offline para encuestas en campo",
  manifest: "/manifest.webmanifest", // <--- Corrección aquí (.webmanifest)
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Encuesta",
  },
};

export const viewport: Viewport = {
  themeColor: "#ef4444",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black min-h-screen overscroll-none`}
      >
        {children}
      </body>
    </html>
  );
}
