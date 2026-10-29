import { defineConfig } from "oxfmt";

export default defineConfig({
  printWidth: 100,
  useTabs: false,
  semi: true,
  tabWidth: 2,
  singleQuote: false,
  sortImports: true,
  sortPackageJson: true,

  overrides: [
    {
      files: ["*.md", "*.html", "*.test.js", "*.spec.ts", "*.yaml"],
      excludeFiles: ["*.min.js"],
      options: {
        printWidth: 120,
      },
    },
  ],
});
