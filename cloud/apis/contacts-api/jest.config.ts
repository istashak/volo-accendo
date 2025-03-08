import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  setupFiles: ["<rootDir>/jest.env.ts"],
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: [
    "./src/**",
    "!**/__mocks__/**",
    "!**/node_modules/**",
    "!**/jest/**",
  ],
  coverageThreshold: {
    global: {},
  },
  coverageReporters: ["cobertura", "json", "html"],
  rootDir: ".",
  testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default jestConfig;
