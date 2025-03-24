import General, { type IGeneralInstance } from "@/components/General";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React, { useRef } from "react";
import { describe, expect, it, vi } from "vitest";

// Mock LoadingButton
vi.mock("@/components/LoadingButton.tsx", () => ({
  __esModule: true,
  default: ({ onClick, className, children }: any) => (
    // biome-ignore lint/a11y/useButtonType: <explanation>
    <button
      onClick={onClick}
      className={className}
      data-testid="loading-button"
    >
      {children}
    </button>
  ),
}));

describe("General Component", () => {
  const mockOnConfirm = vi.fn();

  it("should render General component with default props", () => {
    const props = {
      header: "General Header",
      title: "General Title",
      inputPlaceholder: "Enter value",
      onConfirm: mockOnConfirm,
    };

    render(<General {...props} />);

    // Check header and title rendering
    expect(screen.getByText("General Header")).toBeInTheDocument();
    expect(screen.getByText("General Title")).toBeInTheDocument();

    // Check input placeholder
    expect(screen.getByPlaceholderText("Enter value")).toBeInTheDocument();

    // Check default button placement (bottom-left)
    const button = screen.getByTestId("loading-button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("save");
  });

  it("should update input value when user types", () => {
    const props = {
      header: "Header",
      title: "Title",
      inputPlaceholder: "Type something...",
      onConfirm: mockOnConfirm,
    };

    render(<General {...props} />);

    const input = screen.getByPlaceholderText("Type something...");
    fireEvent.change(input, { target: { value: "New Value" } });

    // Verify input value updated
    expect(input).toHaveValue("New Value");
  });

  it("should call onConfirm with the correct input value on button click", async () => {
    const props = {
      header: "Header",
      title: "Title",
      inputPlaceholder: "Type something...",
      onConfirm: mockOnConfirm,
    };

    render(<General {...props} />);

    const input = screen.getByPlaceholderText("Type something...");
    const button = screen.getByTestId("loading-button");

    // Simulate user typing
    fireEvent.change(input, { target: { value: "Test Value" } });

    // Simulate button click
    fireEvent.click(button);

    // Wait for the async onConfirm to finish
    await waitFor(() =>
      expect(mockOnConfirm).toHaveBeenCalledWith("Test Value"),
    );
  });

  it("should not call onConfirm if input is empty", async () => {
    const props = {
      header: "Header",
      title: "Title",
      inputPlaceholder: "Type something...",
      onConfirm: mockOnConfirm,
    };

    render(<General {...props} />);

    const button = screen.getByTestId("loading-button");

    // Simulate button click without entering input
    fireEvent.click(button);

    // Ensure onConfirm is not called
    await waitFor(() => expect(mockOnConfirm).not.toHaveBeenCalled());
  });

  it("should render button in top-right placement", () => {
    const props = {
      header: "Header",
      title: "Title",
      inputPlaceholder: "Type something...",
      buttonProps: { placement: "top-right" as any },
      onConfirm: mockOnConfirm,
    };

    render(<General {...props} />);

    const button = screen.getByTestId("loading-button");
    // Check if the button exists in the DOM
    expect(button).toBeInTheDocument();
  });

  it("should render extra input if provided", () => {
    const extraInput = <div data-testid="extra-input">Extra Input</div>;
    const props = {
      header: "Header",
      title: "Title",
      extraInput,
      onConfirm: mockOnConfirm,
    };

    render(<General {...props} />);

    // Check if extra input is rendered
    expect(screen.getByTestId("extra-input")).toBeInTheDocument();
  });

  it("should expose updateInput method via ref", () => {
    const TestComponent = () => {
      const ref = useRef<IGeneralInstance>(null);

      return (
        <>
          <General
            ref={ref}
            header="Header"
            title="Title"
            inputPlaceholder="Type something..."
            onConfirm={mockOnConfirm}
          />
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button
            onClick={() => ref.current?.updateInput("Updated Value")}
            data-testid="update-button"
          >
            Update Input
          </button>
        </>
      );
    };

    render(<TestComponent />);

    const input = screen.getByPlaceholderText("Type something...");
    const updateButton = screen.getByTestId("update-button");

    // Verify input is initially empty
    expect(input).toHaveValue("");

    // Trigger updateInput method
    fireEvent.click(updateButton);

    // Verify input value is updated
    expect(input).toHaveValue("Updated Value");
  });
});
