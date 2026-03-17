import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development", // serwist se desactiva en desarrollo
});

const nextConfig: NextConfig = {
  /* ---------------------------------------------------------- */
};

// Exportamos Next.js envuelto con Serwist
export default withSerwist(nextConfig);
