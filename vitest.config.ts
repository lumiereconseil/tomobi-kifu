import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // Tests exercise the payment flow, which only the fictional samples use.
    env: { NEXT_PUBLIC_DEMO_SAMPLES: "1" },
  },
});
