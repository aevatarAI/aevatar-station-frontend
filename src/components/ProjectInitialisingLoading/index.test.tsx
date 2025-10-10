import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the ProjectInitialising component
vi.mock("@/components/ProjectInitialising", () => ({
  default: ({ className }: { className?: string }) => (
    <div data-testid="project-initialising" className={className}>
      Project Initialising
    </div>
  ),
}));

// Mock jotai with a simpler approach
vi.mock("jotai");

// Mock the atom
vi.mock("@/state/atoms", () => ({
  projectInitialisingLoadingAtom: "mock-atom",
}));

import { useAtom } from "jotai";
// Import after mocks
import ProjectInitialisingLoading from "./index";

describe("ProjectInitialisingLoading", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render ProjectInitialising when show is true", () => {
    vi.mocked(useAtom).mockReturnValue([true, vi.fn()]);

    render(<ProjectInitialisingLoading />);

    expect(screen.getByTestId("project-initialising")).toBeInTheDocument();
    expect(screen.getByTestId("project-initialising")).toHaveClass(
      "absolute top-0 left-0 z-500",
    );
  });

  it("should not render anything when show is false", () => {
    vi.mocked(useAtom).mockReturnValue([false, vi.fn()]);

    const { container } = render(<ProjectInitialisingLoading />);

    expect(container.firstChild).toBeNull();
  });

  it("should not render anything when show is undefined", () => {
    vi.mocked(useAtom).mockReturnValue([undefined, vi.fn()]);

    const { container } = render(<ProjectInitialisingLoading />);

    expect(container.firstChild).toBeNull();
  });

  it("should not render anything when show is null", () => {
    vi.mocked(useAtom).mockReturnValue([null, vi.fn()]);

    const { container } = render(<ProjectInitialisingLoading />);

    expect(container.firstChild).toBeNull();
  });

  it("should call useAtom with correct atom", () => {
    vi.mocked(useAtom).mockReturnValue([true, vi.fn()]);

    render(<ProjectInitialisingLoading />);

    expect(useAtom).toHaveBeenCalledWith("mock-atom");
  });

  it("should pass correct className to ProjectInitialising", () => {
    vi.mocked(useAtom).mockReturnValue([true, vi.fn()]);

    render(<ProjectInitialisingLoading />);

    const projectInitialising = screen.getByTestId("project-initialising");
    expect(projectInitialising).toHaveClass(
      "absolute",
      "top-0",
      "left-0",
      "z-500",
    );
  });
});
