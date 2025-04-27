import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock SVG imports
vi.mock("*.svg?react", () => ({
  default: () => null,
}));

// Mock CSS modules
vi.mock("*.module.css", () => ({}));

// Setup global test environment
beforeAll(() => {
  // Add any global setup here
});

afterAll(() => {
  // Add any global cleanup here
});

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
