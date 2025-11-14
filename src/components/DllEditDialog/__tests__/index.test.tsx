import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

// Mock SVG imports
vi.mock("@/assets/dll_menu.svg?react", () => ({
  default: () => <div data-testid="dll-icon" />,
}));
vi.mock("@/assets/edit_action.svg?react", () => ({
  default: () => <div data-testid="edit-icon" />,
}));
vi.mock("@/assets/loading.svg?react", () => ({
  default: ({ className }: { className: string }) => (
    <div data-testid="loading-icon" className={className} />
  ),
}));

// Mock DropzoneItem component
vi.mock("@/components/DropzoneItem", () => ({
  default: ({ form, name, uploadText, accept }: any) => (
    <div data-testid="dropzone" className="w-full">
      <input
        type="file"
        data-testid="file-input"
        accept={Object.values(accept)[0]}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            form.setValue(name, [file]);
          }
        }}
      />
      <div className="text-center">{uploadText}</div>
    </div>
  ),
}));

// Mock useToast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn().mockImplementation((params) => {
      if (params.title === "error") {
        throw new Error(params.description);
      }
    }),
  }),
}));

import DllEditDialog from "../index";

describe("DllEditDialog Component", () => {
  const mockOnSubmit = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders in create mode", () => {
    render(<DllEditDialog type="create" onSubmit={mockOnSubmit} />);
    expect(screen.getByTestId("dll-icon")).toBeInTheDocument();
  });

  it("renders in edit mode", () => {
    render(<DllEditDialog type="edit" onSubmit={mockOnSubmit} />);
    // In edit mode, the dll-icon is not rendered, only the edit button is shown
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("resets form when dialog is opened", async () => {
    render(<DllEditDialog type="create" onSubmit={mockOnSubmit} />);

    // Open dialog
    await user.click(screen.getByRole("button"));

    // Upload file
    const file = new File(["dll content"], "test.dll", {
      type: "application/octet-stream",
    });
    const input = screen.getByTestId("file-input");
    await user.upload(input, file);

    // Close and reopen dialog
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    await user.click(screen.getByRole("button"));

    // Verify form is reset
    const newInput = screen.getByTestId("file-input");
    expect(newInput.files).toHaveLength(0);
  });
});
