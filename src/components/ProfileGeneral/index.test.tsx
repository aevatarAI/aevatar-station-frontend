import { request } from "@/api";
import ProfileGeneral from "@/components/ProfileGeneral";
import { useToast } from "@/hooks/use-toast";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { sendResetPasswordEmail } from "@/services/auth";
import { USER_PROFILE_ATOM } from "@/state/atoms/profile";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useAtom } from "jotai";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));

vi.mock("@/api", () => ({
  request: {
    profile: {
      editProfile: vi.fn(),
    },
  },
}));

vi.mock("@/services/auth", () => ({
  sendResetPasswordEmail: vi.fn(),
}));

vi.mock("@/hooks/useUpdateProfile", () => ({
  useUpdateProfile: vi.fn(),
}));

vi.mock("jotai", async () => {
  const actual = await vi.importActual("jotai");
  return {
    ...actual,
    useAtom: vi.fn(),
  };
});

describe("ProfileGeneral Component", () => {
  const mockToast = vi.fn();
  const mockGetUserProfile = vi.fn();
  const mockUserProfile = {
    userName: "TestUser",
    email: "test@example.com",
    name: "Test",
    surname: "User",
    phoneNumber: "1234567890",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === USER_PROFILE_ATOM) {
        return [mockUserProfile] as any;
      }
      return [null];
    });

    // Mock Toast
    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
      dismiss: vi.fn(),
      toasts: [],
    });

    vi.mocked(useUpdateProfile).mockReturnValue(mockGetUserProfile);
  });

  it("should render the ProfileGeneral component correctly", () => {
    render(<ProfileGeneral />);

    expect(screen.getByPlaceholderText("TestUser")).toBeInTheDocument();
    expect(screen.getByText("save")).toBeInTheDocument();

    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();

    expect(screen.getAllByText("reset password")[1]).toBeInTheDocument();
    // expect(
    //   screen.getAllByText(
    //     "a password reset link will be sent to your email to reset your password."
    //   )[1]
    // ).toBeInTheDocument();
    expect(screen.getAllByText("reset password")[1]).toBeVisible();
  });

  it("should update the username input value", () => {
    render(<ProfileGeneral />);

    const input = screen.getByPlaceholderText("TestUser") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "NewUserName" } });

    expect(input.value).toBe("NewUserName");
  });

  it("should submit updated username when save button is clicked", async () => {
    render(<ProfileGeneral />);

    const input = screen.getByPlaceholderText("TestUser") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "UpdatedUserName" } });

    const saveButton = screen.getByText("save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(request.profile.editProfile).toHaveBeenCalledWith({
        data: {
          userName: "UpdatedUserName",
          email: "test@example.com",
          name: "Test",
          surname: "User",
          phoneNumber: "1234567890",
        },
      });

      expect(mockToast).toHaveBeenCalledWith({
        description: "Successfully",
      });

      expect(mockGetUserProfile).toHaveBeenCalled();
    });
  });

  it("should show error toast when API fails on saving username", async () => {
    vi.mocked(request.profile.editProfile).mockRejectedValue(
      new Error("Edit Failed"),
    );

    render(<ProfileGeneral />);

    const input = screen.getByPlaceholderText("TestUser") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "InvalidName" } });
    fireEvent.click(screen.getByText("save"));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        description: "Edit Failed",
      });
    });
  });

  it("should send reset password email on click reset password button", async () => {
    render(<ProfileGeneral />);

    const resetPasswordButton = screen.getAllByText("reset password")[1];
    fireEvent.click(resetPasswordButton);

    await waitFor(() => {
      expect(sendResetPasswordEmail).toHaveBeenCalledWith("test@example.com");
    });

    expect(mockToast).toHaveBeenCalledWith({
      description: "Reset password email sent successfully!",
    });
  });

  it("should show error toast when reset password API fails", async () => {
    vi.mocked(sendResetPasswordEmail).mockRejectedValue(
      new Error("Reset Failed"),
    );

    render(<ProfileGeneral />);

    const resetPasswordButton = screen.getAllByText("reset password")[1];
    fireEvent.click(resetPasswordButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        description: "Reset Failed",
      });
    });
  });

  it("should not call reset password API if email is missing", async () => {
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === USER_PROFILE_ATOM) {
        return [{ userName: "TestUser" }] as any;
      }
      return [null];
    });

    render(<ProfileGeneral />);

    const resetPasswordButton = screen.getAllByText("reset password")[1];
    fireEvent.click(resetPasswordButton);

    expect(sendResetPasswordEmail).not.toHaveBeenCalled();

    expect(mockToast).toHaveBeenCalledWith({
      description: "email: undefined",
    });
  });
});
