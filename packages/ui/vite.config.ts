import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // No aliases — workspace symlinks + the @govt-leads-hq/tokens package.json
  // `exports` field resolve `@govt-leads-hq/tokens` and `…/css` directly.
});
