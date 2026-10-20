import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const framework = ["react", "react-*", "react/*", "next", "next/*"];

/** The dependency rule from docs/adr/0001: app → ui → application → contexts, never backward. */
const layers = [
  {
    files: ["src/contexts/**"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{ group: [...framework, "@/application/*", "@/ui/*", "@/app/*"], message: "Bounded contexts are plain TypeScript: no React, Next.js, application, or UI imports (docs/adr/0001)." }],
      }],
    },
  },
  {
    files: ["src/application/**"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{ group: [...framework, "@/ui/*", "@/app/*"], message: "The application layer composes contexts; it never imports UI or Next.js (docs/adr/0001)." }],
      }],
    },
  },
  {
    files: ["src/ui/**"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{ group: ["@/contexts/*", "@/app/*"], message: "UI renders the homepage view from @/application; it does not reach into contexts (docs/adr/0001)." }],
      }],
    },
  },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...layers,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "reference/**",
    "tools/**",
  ]),
]);

export default eslintConfig;
