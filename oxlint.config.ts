import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["typescript", "unicorn"],

  categories: {
    correctness: "error",
    suspicious: "warn",
  },

  rules: {
    "no-console": "warn",
    "typescript/no-explicit-any": "error",
  },

  options: {
    typeAware: true,
  },
});
