import type { Config } from "@jest/types";
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  coveragePathIgnorePatterns: [
    "app.ts",
    "migrations/*",
    "seeding/*",
    "entities/*",
    "repositories/*",
    ".types.ts",
  ],
  collectCoverageFrom: ["src/**/*.ts", "!**/node_modules/**"],
  coverageReporters: ["html", "text", "text-summary", "cobertura"],
};

export default config;
