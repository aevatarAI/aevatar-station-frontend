import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DescHome from "./DescHome";

describe("DescHome", () => {
  it("renders the component with correct content", () => {
    render(<DescHome />);

    expect(screen.getByText("aevatar.ai")).toBeInTheDocument();
    expect(
      screen.getByText("the future of on-chain autonomous intelligence"),
    ).toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    const customClass = "custom-class";
    render(<DescHome className={customClass} />);

    const container = screen.getByText("aevatar.ai").parentElement;
    expect(container).toHaveClass(customClass);
  });

  it("applies default classes", () => {
    render(<DescHome />);

    const container = screen.getByText("aevatar.ai").parentElement;
    expect(container).toHaveClass("gap-5", "flex", "flex-col");
  });

  it("renders heading with correct styles", () => {
    render(<DescHome />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveClass(
      "text-[36px]",
      "lg:text-[54px]",
      "font-semibold",
      "font-syne",
      "leading-9",
      "lg:leading-[54px]",
    );
  });

  it("renders paragraph with correct styles", () => {
    render(<DescHome />);

    const paragraph = screen.getByText(
      "the future of on-chain autonomous intelligence",
    );
    expect(paragraph).toHaveClass(
      "text-[var(--muted-foreground)]",
      "text-[16px]",
      "font-semibold",
    );
  });

  it("renders without className prop", () => {
    render(<DescHome />);

    expect(screen.getByText("aevatar.ai")).toBeInTheDocument();
    expect(
      screen.getByText("the future of on-chain autonomous intelligence"),
    ).toBeInTheDocument();
  });
});
