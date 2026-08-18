import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // The app reads these at module load to build request URLs. Tests mock fetch and
  // never hit the network, so these are placeholders — deliberately fake hosts so
  // nobody mistakes them for real endpoints. Only the vars src actually reads are
  // defined (VITE_TWITCH_ID_ENDPOINT / VITE_TWITCH_API_ENDPOINT are unused; Twitch
  // URLs are hardcoded in useTwitchApi).
  define: {
    "import.meta.env.VITE_BUILD_TIME": "0",
    "import.meta.env.VITE_THERUN_API_ENDPOINT": JSON.stringify(
      "http://therun.test"
    ),
    "import.meta.env.VITE_THERUN_RACES_ENDPOINT": JSON.stringify(
      "http://therun.test/races"
    ),
    "import.meta.env.VITE_TWITCH_CLIENT_ID": JSON.stringify("test-client-id"),
  },
  test: {
    environment: "jsdom",
    environmentOptions: {
      jsdom: {
        // parseOBSOverlayURL compares a frame URL's origin to the app's origin, so
        // pin it to a known value tests can match against.
        url: "http://localhost:5173",
      },
    },
    setupFiles: ["./src/testing/setup.ts"],
    globals: false,
    clearMocks: true,
    include: ["src/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
  },
});
