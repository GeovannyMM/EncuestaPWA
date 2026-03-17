import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Encuesta Alfabetismo",
    short_name: "EncuestaPWA",
    description: "PWA Offline para encuestas de alfabetismo",
    start_url: "/",
    display: "standalone", // Esto es clave: "standalone" le dice al celular que se comporte como aplicación nativa, ocultando la barra del navegador.
    background_color: "#ffffff",
    theme_color: "#ef4444", // Usamos el rojo (red-500) que tienes en tus botones como color de tema (la barra de arriba del celular).
    icons: [
      {
        src: "/window.svg", // Temporal. Usaremos uno de tus iconos svg predeterminados.
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/globe.svg", // Temporal. Idealmente aquí irían iconos .png de tamaño 512x512
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
