import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/tv-series-progress-tracker/",
    build: { sourcemap: false },
    plugins: [react()],
});