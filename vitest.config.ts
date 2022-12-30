import * as path from "path";
import * as VitestConfig from "vitest/config";
import react from "@vitejs/plugin-react";

export default VitestConfig.defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    watch: false,
    include: ["./tests/**/*.test.{ts,tsx}"],
    includeSource: ["app/**/*.{ts,tsx}"],
    coverage: {
      exclude: ["app/mocks.tsx"],
      reporter: process.env.CI ? "json" : "html-spa",
    },
    setupFiles: "./tests/global-setup.ts",
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "app"),
    },
  },
  plugins: [react()],
});
