import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DropzoneItem from ".";

vi.mock("react-hook-form", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    useForm: vi.fn().mockReturnValue({
      handleSubmit: (fn: any) => fn,
      control: {},
      setValue: vi.fn(),
      getValues: vi.fn(),
      setError: vi.fn(),
      reset: vi.fn(),
      clearErrors: vi.fn(),
      getFieldState: vi.fn().mockReturnValue({ error: null }),
    }),
    FormProvider: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    useFormContext: vi.fn().mockReturnValue({
      getFieldState: vi.fn(),
      formState: {
        isDirty: false,
        isSubmitting: false,
        isValid: true,
      },
    }),
    Controller: ({ render }: any) => render({ value: "", onChange: vi.fn() }),
    useFieldArray: vi.fn(),
  };
});

vi.mock("react-dropzone", () => ({
  default: ({ onDropRejected, onDropAccepted, children }: any) => {
    const props = {
      getRootProps: () => ({
        onClick: () => {},
        "data-testid": "dropzone-id",
      }),
      getInputProps: () => ({
        type: "file",
        onChange: (e: any) => {
          const files = e.target.files;
          if (files && files[0]?.size > 1000) {
            onDropRejected([
              {
                errors: [
                  {
                    message: "File is too large",
                  },
                ],
              },
            ]);
          } else if (files && files[0]?.type !== "application/pdf") {
            onDropRejected([{}]);
          } else if (files) {
            onDropAccepted(Array.from(files));
          }
        },
      }),
    };
    return children(props);
  },
}));

describe("DropzoneItem", () => {
  let mockForm: ReturnType<typeof useForm>;
  let mockAppend: ReturnType<typeof vi.fn>;
  let mockRemove: ReturnType<typeof vi.fn>;
  let mockClearErrors: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockAppend = vi.fn();
    mockRemove = vi.fn();
    mockClearErrors = vi.fn();

    mockForm = useForm();
    mockForm.clearErrors = mockClearErrors;

    vi.mocked(useForm).mockReturnValue({
      ...mockForm,
      control: {},
      setValue: vi.fn(),
      getValues: vi.fn(),
      setError: vi.fn(),
      reset: vi.fn(),
      clearErrors: mockClearErrors,
      getFieldState: vi.fn().mockReturnValue({ error: null }),
    });

    vi.mocked(useFieldArray).mockReturnValue({
      fields: [],
      append: mockAppend,
      remove: mockRemove,
    });
  });

  it("should render Dropzone component with default props", () => {
    render(
      <FormProvider {...mockForm}>
        <DropzoneItem form={mockForm} name="knowledgeBase" />
      </FormProvider>,
    );

    expect(screen.getByTestId("dropzone-id")).toBeInTheDocument();
    expect(screen.getByText("click to select")).toBeInTheDocument();
  });

  it("should render Dropzone component with custom upload text", () => {
    render(
      <FormProvider {...mockForm}>
        <DropzoneItem
          form={mockForm}
          name="knowledgeBase"
          uploadText="Custom upload text"
        />
      </FormProvider>,
    );

    expect(screen.getByText("Custom upload text")).toBeInTheDocument();
  });

  it("should add file to the form when file is uploaded", async () => {
    render(
      <FormProvider {...mockForm}>
        <DropzoneItem form={mockForm} name="knowledgeBase" />
      </FormProvider>,
    );

    const file = new File(["test"], "test.pdf", { type: "application/pdf" });
    const dropzone = screen.getByTestId("dropzone-id");
    const input = dropzone.querySelector("input") as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockClearErrors).toHaveBeenCalledWith("knowledgeBase");
      expect(mockAppend).toHaveBeenCalledWith({
        name: file.name,
        content: file,
      });
    });
  });

  it("should show error when file upload is rejected", async () => {
    const mockSetError = vi.fn();
    mockForm.setError = mockSetError;

    render(
      <FormProvider {...mockForm}>
        <DropzoneItem form={mockForm} name="knowledgeBase" maxSize={1000} />
      </FormProvider>,
    );

    const largeFile = new File(["large file".repeat(1000)], "large.pdf", {
      type: "application/pdf",
    });

    const dropzone = screen.getByTestId("dropzone-id");
    const input = dropzone.querySelector("input") as HTMLInputElement;

    fireEvent.change(input, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith("knowledgeBase", {
        message: "File is too large",
      });
    });
  });

  it("should show default error message when error details are missing", async () => {
    const mockSetError = vi.fn();
    mockForm.setError = mockSetError;

    render(
      <FormProvider {...mockForm}>
        <DropzoneItem
          form={mockForm}
          name="knowledgeBase"
          accept={{ "application/pdf": [".pdf"] }}
        />
      </FormProvider>,
    );

    const invalidFile = new File(["test"], "test.txt", { type: "text/plain" });
    const dropzone = screen.getByTestId("dropzone-id");
    const input = dropzone.querySelector("input") as HTMLInputElement;

    fireEvent.change(input, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith("knowledgeBase", {
        message: "Upload file error",
      });
    });
  });

  it("should hide label when hiddenLabel is true", () => {
    render(
      <FormProvider {...mockForm}>
        <DropzoneItem form={mockForm} name="knowledgeBase" hiddenLabel={true} />
      </FormProvider>,
    );

    const label = screen.getByText("knowledgeBase");
    expect(label.className).toContain("hidden");
  });

  it("should show label when hiddenLabel is false", () => {
    render(
      <FormProvider {...mockForm}>
        <DropzoneItem
          form={mockForm}
          name="knowledgeBase"
          hiddenLabel={false}
        />
      </FormProvider>,
    );

    const label = screen.getByText("knowledgeBase");
    expect(label.className).not.toContain("hidden");
  });

  it("should remove file when minus icon is clicked", async () => {
    vi.mocked(useFieldArray).mockReturnValue({
      fields: [
        { id: "1", name: "test.pdf", content: new File(["test"], "test.pdf") },
      ],
      append: mockAppend,
      remove: mockRemove,
    });

    render(
      <FormProvider {...mockForm}>
        <DropzoneItem form={mockForm} name="knowledgeBase" />
      </FormProvider>,
    );

    const removeButton = screen.getByRole("img");
    fireEvent.click(removeButton);

    expect(mockRemove).toHaveBeenCalledWith(0);
  });

  it("should handle multiple file uploads", async () => {
    render(
      <FormProvider {...mockForm}>
        <DropzoneItem form={mockForm} name="knowledgeBase" multiple={true} />
      </FormProvider>,
    );

    const files = [
      new File(["test1"], "test1.pdf", { type: "application/pdf" }),
      new File(["test2"], "test2.pdf", { type: "application/pdf" }),
    ];

    const dropzone = screen.getByTestId("dropzone-id");
    const input = dropzone.querySelector("input") as HTMLInputElement;

    fireEvent.change(input, { target: { files } });

    await waitFor(() => {
      expect(mockClearErrors).toHaveBeenCalledWith("knowledgeBase");
      expect(mockAppend).toHaveBeenCalledTimes(2);
    });
  });

  it("should handle single file upload when multiple is false", async () => {
    render(
      <FormProvider {...mockForm}>
        <DropzoneItem form={mockForm} name="knowledgeBase" multiple={false} />
      </FormProvider>,
    );

    const file = new File(["test"], "test.pdf", { type: "application/pdf" });
    const dropzone = screen.getByTestId("dropzone-id");
    const input = dropzone.querySelector("input") as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockClearErrors).toHaveBeenCalledWith("knowledgeBase");
      expect(mockAppend).toHaveBeenCalledWith({
        name: file.name,
        content: file,
      });
    });
  });
});
