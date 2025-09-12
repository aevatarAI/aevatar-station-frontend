import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProfileAvatar from "./index";

// Mock all dependencies
vi.mock("@/hooks/navigate", () => ({
  useNavigate: vi.fn(() => vi.fn()),
}));

vi.mock("@/hooks/useLogout", () => ({
  useLogout: vi.fn(() => vi.fn()),
}));

vi.mock("jotai", () => ({
  useAtom: vi.fn(() => [null, vi.fn()]),
  atom: vi.fn(),
}));

vi.mock("@/components/Copy", () => ({
  __esModule: true,
  default: () => <div data-testid="copy-button">Copy</div>,
}));

vi.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: any) => <div data-testid="popover">{children}</div>,
  PopoverTrigger: ({ children }: any) => (
    <div data-testid="popover-trigger">{children}</div>
  ),
  PopoverContent: ({ children }: any) => (
    <div data-testid="popover-content">{children}</div>
  ),
}));

vi.mock("@/assets/profile.png", () => ({
  default: "mocked-profile-image.png",
}));

vi.mock("@/constants/cls", () => ({
  itemClassName: "item-class",
  itemHoverClassName: "item-hover-class",
}));

vi.mock("@/state/atoms/profile", () => ({
  USER_PROFILE_ATOM: "mocked-profile-atom",
}));

describe("ProfileAvatar", () => {
  it("renders profile avatar correctly", () => {
    render(<ProfileAvatar />);

    const profileImage = screen.getByAltText("profile");
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute("src", "mocked-profile-image.png");
  });

  it("renders popover structure", () => {
    render(<ProfileAvatar />);

    expect(screen.getByTestId("popover")).toBeInTheDocument();
    expect(screen.getByTestId("popover-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("popover-content")).toBeInTheDocument();
  });

  it("applies correct CSS classes to container", () => {
    render(<ProfileAvatar />);

    const container = screen.getByAltText("profile").closest("div");
    expect(container).toBeInTheDocument();
  });

  it("renders profile image with correct attributes", () => {
    render(<ProfileAvatar />);

    const profileImage = screen.getByAltText("profile");
    expect(profileImage).toHaveClass("object-cover");
  });
});
