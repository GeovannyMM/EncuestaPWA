import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";
import { clientsClaim } from "serwist/internal";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: [
    ...(self.__SW_MANIFEST || []),
    { url: "/", revision: "v1-app-router" }
  ],
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
