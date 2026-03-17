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

// 1. Aquí conectamos nuestra PWA con el navegador
export const metadata: Metadata = {
  title: "Encuesta Alfabetismo",
  description: "PWA Offline para encuestas en campo",
  manifest: "/manifest.json", // Le decimos a Next que busque el manifest que creamos
};

// 2. Fundamental para que no se vea la "pantalla negra o plana" en celulares
export const viewport: Viewport = {
  themeColor: "#ef4444",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Evita que al hacer doble tap, la app haga zoom (daña la experiencia de app nativa)
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
