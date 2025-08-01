
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, "../server/certificate/localhost.key")
      ),
      cert: fs.readFileSync(
        path.resolve(__dirname, "../server/certificate/localhost.crt")
      ),
    },
    port: 5173,
  },
});