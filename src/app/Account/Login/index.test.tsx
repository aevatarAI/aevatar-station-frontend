import { service } from "@/api/axios";
import { useNavigate } from "@/hooks/navigate";
import { login } from "@/services/auth";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import LoginPage from ".";

// Mock the necessary modules
vi.mock("@/services/auth");
vi.mock("@/hooks/navigate");
vi.mock("@/api/axios");

describe("Login Component", () => {
  it("renders correctly", () => {
    render(<LoginPage />);
    expect(screen.getByText("login")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("enter your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
    expect(screen.getByText("log in")).toBeInTheDocument();
  });
});
