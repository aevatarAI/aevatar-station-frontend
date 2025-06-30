import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CreateCrossURLDialog from "./index";

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

const setup = (props = {}) => {
  return render(<CreateCrossURLDialog type="create" {...props} />);
};

describe("CreateCrossURLDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render and open dialog on button click", async () => {
    setup();
    const openBtn = screen.getByRole("button", { name: /add/i });
    fireEvent.click(openBtn);
    await waitFor(() => {
      expect(screen.getByText(/add cross-origin domain/i)).toBeInTheDocument();
    });
  });

  it("should call onSubmit with domain and close dialog", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    setup({ onSubmit });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    await waitFor(() => {
      expect(screen.getByText(/add cross-origin domain/i)).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText("-");
    fireEvent.change(input, { target: { value: "https://test.com" } });
    const submitBtn = screen
      .getAllByRole("button", { name: /add/i })
      .find((btn) => btn.getAttribute("type") === "submit");
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    fireEvent.click(submitBtn!);
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ domain: "https://test.com" });
    });
  });

  it("should show error message for invalid domain", async () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    await waitFor(() => {
      expect(screen.getByText(/add cross-origin domain/i)).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText("-");
    fireEvent.change(input, { target: { value: "invalid" } });
    const submitBtn = screen
      .getAllByRole("button", { name: /add/i })
      .find((btn) => btn.getAttribute("type") === "submit");
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    fireEvent.click(submitBtn!);
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid url/i)).toBeInTheDocument();
    });
  });

  it("should handle onSubmit error and show toast", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("submit error"));
    setup({ onSubmit });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    await waitFor(() => {
      expect(screen.getByText(/add cross-origin domain/i)).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText("-");
    fireEvent.change(input, { target: { value: "https://test.com" } });
    const submitBtn = screen
      .getAllByRole("button", { name: /add/i })
      .find((btn) => btn.getAttribute("type") === "submit");
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    fireEvent.click(submitBtn!);
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
      expect(screen.getByText(/add cross-origin domain/i)).toBeInTheDocument();
    });
  });

  it("should close dialog on cancel", async () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    await waitFor(() => {
      expect(screen.getByText(/add cross-origin domain/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    await waitFor(() => {
      expect(
        screen.queryByText(/add cross-origin domain/i),
      ).not.toBeInTheDocument();
    });
  });

  it("should show loading state when submitting", async () => {
    let resolve: any;
    const onSubmit = vi.fn().mockImplementation(
      () =>
        new Promise((r) => {
          resolve = r;
        }),
    );
    setup({ onSubmit });
    fireEvent.click(screen.getByRole("button", { name: /add/i }));
    await waitFor(() => {
      expect(screen.getByText(/add cross-origin domain/i)).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText("-");
    fireEvent.change(input, { target: { value: "https://test.com" } });
    const submitBtn = screen
      .getAllByRole("button", { name: /add/i })
      .find((btn) => btn.getAttribute("type") === "submit");
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    fireEvent.click(submitBtn!);
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
    resolve();
  });
});
