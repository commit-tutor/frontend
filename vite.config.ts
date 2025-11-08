import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import * as path from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";
import {TanStackRouterVite} from "@tanstack/router-vite-plugin";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths(), TanStackRouterVite()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  server: {
    port: 5174,
    strictPort: true,
  }
})
