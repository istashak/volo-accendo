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
  rootDir: "./tests",
  testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
};

export default jestConfig;
