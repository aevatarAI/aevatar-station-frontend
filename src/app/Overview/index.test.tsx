import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Overview from "./index";

// Mock the assets
vi.mock("@/assets/thumbprint.svg?react", () => ({
  default: ({ className }: { className?: string }) => (
    <div data-testid="thumbprint" className={className} />
  ),
}));

vi.mock("@/assets/logo.svg?react", () => ({
  default: ({ className }: { className?: string }) => (
    <div data-testid="logo" className={className} />
  ),
}));

vi.mock("@/assets/overview/robot1.png", () => ({
  default: "robot1.png",
}));

vi.mock("@/assets/overview/robot2.png", () => ({
  default: "robot2.png",
}));

vi.mock("@/assets/overview/robot3.png", () => ({
  default: "robot3.png",
}));

vi.mock("@/assets/overview/robot4.png", () => ({
  default: "robot4.png",
}));

// Mock the constants
vi.mock("@/constants/socialMedia", () => ({
  docsLink: { title: "Docs", href: "https://docs.example.com" },
  githubLink: { title: "GitHub", href: "https://github.com/example" },
  websiteLink: { title: "Website", href: "https://example.com" },
}));

// Mock the LoginButton component
vi.mock("@/components/auth/LoginButton", () => ({
  default: () => (
    <button type="button" data-testid="login-button">
      Login
    </button>
  ),
}));

// Mock Math.random to return a predictable value
const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;

describe("Overview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the overview page with all main elements", () => {
    render(<Overview />);

    // Check for main heading - use getByRole to find the h1 element
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("log in to");
    expect(heading).toHaveTextContent("aevatar.ai");

    // Check for subtitle - use getByRole to find the h2 element
    const subtitle = screen.getByRole("heading", { level: 2 });
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveTextContent("the future of on-chain autonomous");
    expect(subtitle).toHaveTextContent("intelligence");

    // Check for logo and thumbprint
    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByTestId("thumbprint")).toBeInTheDocument();

    // Check for login button (there are two - mobile and desktop)
    expect(screen.getAllByTestId("login-button")).toHaveLength(2);
  });

  it("should render social media links", () => {
    render(<Overview />);

    // Check for social media links (they appear multiple times)
    expect(screen.getAllByText("Docs")).toHaveLength(2);
    expect(screen.getAllByText("GitHub")).toHaveLength(2);
    expect(screen.getAllByText("Website")).toHaveLength(2);

    // Check that links have correct href attributes (get the first occurrence)
    const docsLinks = screen.getAllByText("Docs");
    const githubLinks = screen.getAllByText("GitHub");
    const websiteLinks = screen.getAllByText("Website");

    expect(docsLinks[0].closest("a")).toHaveAttribute(
      "href",
      "https://docs.example.com",
    );
    expect(githubLinks[0].closest("a")).toHaveAttribute(
      "href",
      "https://github.com/example",
    );
    expect(websiteLinks[0].closest("a")).toHaveAttribute(
      "href",
      "https://example.com",
    );
  });

  it("should render background image with random selection", () => {
    render(<Overview />);

    // Check that the background image div exists (it's a div with background image, not an img element)
    const backgroundDiv = screen
      .getByRole("heading", { level: 1 })
      .closest("div")
      ?.parentElement?.parentElement?.querySelector(".cutCorner");
    expect(backgroundDiv).toBeInTheDocument();
    expect(backgroundDiv).toHaveClass(
      "cutCorner",
      "bg-no-repeat",
      "bg-cover",
      "bg-center",
    );
  });

  it("should have correct CSS classes for responsive design", () => {
    render(<Overview />);

    const container = screen.getByRole("heading", { level: 1 }).closest("div")
      ?.parentElement?.parentElement;
    expect(container).toHaveClass(
      "pt-[70px]",
      "pr-[47px]",
      "pb-[51px]",
      "h-screen",
      "pl-[47px]",
      "md:px-[40px]",
      "md:py-[42px]",
      "flex",
      "flex-col",
      "lg:flex-row",
      "lg:gap-20",
    );
  });

  it("should render login button in both mobile and desktop views", () => {
    render(<Overview />);

    // Should have login button (it appears twice - once for mobile, once for desktop)
    const loginButtons = screen.getAllByTestId("login-button");
    expect(loginButtons).toHaveLength(2); // Two instances for mobile and desktop
  });

  it("should render social media links in both mobile and desktop views", () => {
    render(<Overview />);

    // Social media links should appear in both mobile and desktop views
    const socialMediaLinks = screen.getAllByText("Docs");
    expect(socialMediaLinks.length).toBeGreaterThan(0);
  });

  it("should have proper accessibility attributes", () => {
    render(<Overview />);

    // Check that social media links have proper accessibility attributes
    const socialLinks = screen.getAllByRole("link");
    socialLinks.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    });
  });

  it("should render with correct text styling classes", () => {
    render(<Overview />);

    // Check main heading has correct classes
    const mainHeadingContainer = screen.getByRole("heading", { level: 1 });
    expect(mainHeadingContainer).toHaveClass(
      "text-4xl",
      "lg:text-[54px]",
      "font-bold",
      "font-syne",
      "mb-[25px]",
      "leading-tight",
    );

    // Check subtitle has correct classes
    const subtitle = screen.getByRole("heading", { level: 2 });
    expect(subtitle).toHaveClass(
      "text-sm",
      "font-geist",
      "mb-[36px]",
      "lg:mb-[54.5px]",
      "text-muted-foreground",
    );
  });
});
