import ProfileAvatar from "@/components/ProfileAvatar";
import { useNavigate } from "@/hooks/navigate";
import { useLogout } from "@/hooks/useLogout";
import { useTheme } from "@/hooks/useTheme";
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

vi.mock("@/hooks/useTheme", () => ({
  useTheme: vi.fn(),
}));

// Mock useAtom
vi.mock("jotai", () => ({
  useAtom: vi.fn(),
}));

describe("ProfileAvatar Component", () => {
  const mockNavigate = vi.fn();
  const mockLogout = vi.fn();
  const mockToggleTheme = vi.fn();
  const mockProfile = {
    userName: "Test User",
    email: "test@example.com",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useLogout).mockReturnValue(mockLogout);
    vi.mocked(useTheme).mockReturnValue({
      theme: "dark" as const,
      toggleTheme: mockToggleTheme,
      setLightTheme: vi.fn(),
      setDarkTheme: vi.fn(),
      isLight: false,
      isDark: true,
    });
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

    // Click profile link - use getAllByText and select the span element
    await waitFor(() => {
      const accountElements = screen.getAllByText("Account");
      const accountSpan = accountElements.find((el) => el.tagName === "SPAN");
      accountSpan && fireEvent.click(accountSpan);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  // Removed notifications test as the component doesn't have this functionality
  // it("navigates to notifications page when notifications link is clicked", async () => {
  //   render(<ProfileAvatar />);

  //   // Open popover
  //   fireEvent.click(screen.getByAltText("profile"));

  //   // Click notifications link - use getAllByText and select the span element
  //   await waitFor(() => {
  //     const notificationsElements = screen.getAllByText("Notifications");
  //     const notificationsSpan = notificationsElements.find(
  //       (el) => el.tagName === "SPAN",
  //     );
  //     notificationsSpan && fireEvent.click(notificationsSpan);
  //   });

  //   expect(mockNavigate).toHaveBeenCalledWith("/notifications");
  // });

  it("logs out and navigates to login page when logout is clicked", async () => {
    render(<ProfileAvatar />);

    // Open popover
    fireEvent.click(screen.getByAltText("profile"));

    // Click logout link
    await waitFor(() => {
      fireEvent.click(screen.getByText("Log out"));
    });

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("toggles theme when theme toggle is clicked", async () => {
    render(<ProfileAvatar />);

    // Open popover
    fireEvent.click(screen.getByAltText("profile"));

    // Click theme toggle
    await waitFor(() => {
      fireEvent.click(screen.getByText("Light theme"));
    });

    expect(mockToggleTheme).toHaveBeenCalled();
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
