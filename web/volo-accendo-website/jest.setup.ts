import "@testing-library/jest-dom";
import React from "react";
import type { jest } from "@jest/globals";

declare global {
  var jest: typeof jest;
}

// Mock next/navigation
const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
};

jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => "",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => React.createElement("img", props),
}));
