import ProfileAvatar from "@/components/ProfileAvatar";
import { useNavigate } from "@/hooks/navigate";
import { useLogout } from "@/hooks/useLogout";
import { USER_PROFILE_ATOM } from "@/state/atoms/profile";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useAtom } from "jotai";
import { vi } from "vitest";

// Mock hooks
vi.mock("@/hooks/navigate", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("@/hooks/useLogout", () => ({
  useLogout: vi.fn(),
}));

// Mock useAtom
vi.mock("jotai", () => ({
  useAtom: vi.fn(),
}));

describe("ProfileAvatar Component", () => {
  const mockNavigate = vi.fn();
  const mockLogout = vi.fn();
  const mockProfile = {
    userName: "Test User",
    email: "test@example.com",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useLogout).mockReturnValue(mockLogout);
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === USER_PROFILE_ATOM) {
        return [mockProfile] as any;
      }
      return [null];
    });
  });

  it("renders profile avatar with image", () => {
    render(<ProfileAvatar />);
    expect(screen.getByAltText("profile")).toBeInTheDocument();
  });

  it("displays user name and email in popover", async () => {
    render(<ProfileAvatar />);

    // Open popover
    fireEvent.click(screen.getByAltText("profile"));

    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });
  });

  it("navigates to profile page when profile link is clicked", async () => {
    render(<ProfileAvatar />);

    // Open popover
    fireEvent.click(screen.getByAltText("profile"));

    // Click profile link
    await waitFor(() => {
      fireEvent.click(screen.getByText("profile"));
    });

    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  it("logs out and navigates to login page when logout is clicked", async () => {
    render(<ProfileAvatar />);

    // Open popover
    fireEvent.click(screen.getByAltText("profile"));

    // Click logout link
    await waitFor(() => {
      fireEvent.click(screen.getByText("log out"));
    });

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("handles missing profile data gracefully", () => {
    vi.mocked(useAtom).mockImplementation((atom) => {
      if (atom === USER_PROFILE_ATOM) {
        return [null] as any;
      }
      return [null];
    });

    render(<ProfileAvatar />);

    // Open popover
    fireEvent.click(screen.getByAltText("profile"));

    expect(screen.getByText("--")).toBeInTheDocument();
  });
});
