import { defineConfig } from "@standard-config/oxlint";

export default defineConfig({
  rules: {
    "import/no-unassigned-import": [
      "error",
      {
        allow: ["**/*.css"],
      },
    ],
  },
});

// export default defineConfig({
//   plugins: ["typescript", "unicorn"],
//
//   categories: {
//     correctness: "error",
//     suspicious: "warn",
//   },
//
//   rules: {
//     "no-console": "warn",
//     "typescript/no-explicit-any": "error",
//   },
//
//   options: {
//     typeAware: true,
//   },
// });
