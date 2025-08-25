import LoadingButton from "@/components/LoadingButton.tsx";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/assets/loading.svg?react", () => ({
  __esModule: true,
  default: ({ className }: { className: string }) => (
    <div data-testid="loading-icon" className={className}>
      Loading...
    </div>
  ),
}));

describe("LoadingButton Component", () => {
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  const mockOnClick = vi.fn();
  const mockOnLoadingChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the button with provided children", () => {
    render(<LoadingButton>Click Me</LoadingButton>);

    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Click Me");
  });

  it("should apply custom className to the button", () => {
    render(<LoadingButton className="custom-class">Click Me</LoadingButton>);

    const button = screen.getByRole("button");

    expect(button).toHaveClass("custom-class");
  });

  it("should show loading icon during async operation", async () => {
    const mockAsync = vi.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100)) as any,
    );

    render(
      <LoadingButton onClick={mockAsync} onLoadingChange={mockOnLoadingChange}>
        Click Me
      </LoadingButton>,
    );

    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(screen.getByTestId("loading-icon")).toBeInTheDocument();

    expect(mockOnLoadingChange).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(mockAsync).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.queryByTestId("loading-icon")).not.toBeInTheDocument();
    });

    expect(mockOnLoadingChange).toHaveBeenCalledWith(false);
  });

  it("should handle onClick and stop loading after async operation", async () => {
    const mockAsync = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 100);
        }),
    );

    render(<LoadingButton onClick={mockAsync}>Click Me</LoadingButton>);

    const button = screen.getByRole("button");

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockAsync).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByTestId("loading-icon")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("loading-icon")).not.toBeInTheDocument();
    });
  });

  it("should not crash if onClick is not provided", async () => {
    render(<LoadingButton>Click Me</LoadingButton>);

    const button = screen.getByRole("button");

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("loading-icon")).not.toBeInTheDocument();
  });

  it("should pass additional props to the underlying button", () => {
    render(
      <LoadingButton type="submit" form="test-form">
        Submit
      </LoadingButton>,
    );

    const button = screen.getByRole("button");

    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("form", "test-form");
  });
});
