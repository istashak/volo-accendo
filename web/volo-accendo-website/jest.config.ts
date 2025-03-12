import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.mjs and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  coverageProvider: "v8",
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}",
    "!app/**/*.d.ts",
    "!app/**/types.ts",
    "!app/**/*.stories.{js,jsx,ts,tsx}",
    "!**/*.config.*",
    "!**/node_modules/**",
    "!<rootDir>/coverage/**",
  ],
  testMatch: [
    "<rootDir>/**/*.test.{js,jsx,ts,tsx}",
    "<rootDir>/**/*.spec.{js,jsx,ts,tsx}",
  ],
  moduleNameMapper: {
    // Handle CSS imports (if you're using them)
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
    "^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$":
      "<rootDir>/__mocks__/fileMock.js",
    // Handle module aliases
    "^@/(.*)$": "<rootDir>/app/$1",
  },
  // Handle Haste module naming collision
  modulePathIgnorePatterns: [".lambdas"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
