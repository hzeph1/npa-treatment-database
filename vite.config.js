import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" makes the build work whether it's served from a domain root
// (Netlify/Vercel) or a subfolder like npallies.org/treatments/.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
