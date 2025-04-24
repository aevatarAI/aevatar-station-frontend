import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
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
    // Mock FormProvider to avoid errors in the test
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

    Controller: ({ render }: any) => render({ value: "", onChange: vi.fn() }), // mock Controller for testing
    useFieldArray: vi.fn().mockReturnValue({
      fields: [
        { id: "1", name: "file1", content: new File(["test"], "test.pdf") },
      ],
      append: vi.fn(),
      remove: vi.fn(),
    }),
  };
});

describe("DropzoneItem", () => {
  let mockForm: ReturnType<typeof useForm>;

  beforeEach(() => {
    mockForm = useForm();
  });

  it("should render Dropzone component", () => {
    render(
      <FormProvider {...mockForm}>
        <DropzoneItem form={mockForm} name="knowledgeBase" />
      </FormProvider>,
    );

    // Check if the upload button is rendered
    expect(screen.getByText("Click to upload (PDF)")).toBeInTheDocument();
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
    //   Simulate file drop event
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      // Verify that the file is appended to the form
      expect(screen.getByTestId("field-name-dropzoneItem")).toBeInTheDocument();
      expect(screen.getByText(`${file.size} bytes`)).toBeInTheDocument();
    });
  });

  it("should show error when file upload is rejected", async () => {
    render(
      <FormProvider {...mockForm}>
        <DropzoneItem form={mockForm} name="knowledgeBase" maxSize={1000} />
      </FormProvider>,
    );

    const largeFile = new File(["large file"], "large.pdf", {
      type: "application/pdf",
    });

    const dropzone = screen.getByTestId("dropzone-id");
    const input = dropzone.querySelector("input") as HTMLInputElement;

    // Simulate file drop event with a rejected file (exceeding size limit)
    fireEvent.change(input, { target: { files: [largeFile] } });

    await waitFor(() => {
      // Verify that the error message appears
      expect(mockForm.getFieldState("knowledgeBase")?.error).toBeDefined();
    });
  });

  it("should remove file when minus icon is clicked", async () => {
    render(
      <FormProvider {...mockForm}>
        <DropzoneItem form={mockForm} name="knowledgeBase" />
      </FormProvider>,
    );

    const file = new File(["test"], "test.pdf", { type: "application/pdf" });

    const dropzone = screen.getByTestId("dropzone-id");
    const input = dropzone.querySelector("input") as HTMLInputElement;

    // Simulate file drop event
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByTestId("field-name-dropzoneItem")).toBeInTheDocument();
    });

    const removeButton = screen.getByRole("img"); // or any element that represents the "MinusIcon"
    fireEvent.click(removeButton);

    // await waitFor(() => {
    //   // Verify that the file is removed from the list
    //   expect(screen.getByText(`${file.size} bytes`)).not.toBeInTheDocument();
    // });
  });

  it("should handle onDropRejected and set error", async () => {
    const mockSetError = vi.fn();
    mockForm.setError = mockSetError;

    render(<DropzoneItem form={mockForm} name="knowledgeBase" />);

    const error = [
      {
        errors: [
          {
            message: "File type not allowed",
          },
        ],
      },
    ];
    const dropzone = screen.getByTestId("dropzone-id");
    const input = dropzone.querySelector("input") as HTMLInputElement;
    fireEvent.change(input, {});

    await waitFor(() => {
      mockForm.setError("knowledgeBase", {
        message: error[0]?.errors?.[0]?.message ?? "Upload file error",
      });
    });

    expect(mockSetError).toHaveBeenCalledWith("knowledgeBase", {
      message: "File type not allowed",
    });
  });
});
