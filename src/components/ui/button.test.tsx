import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders button with default props", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("px-[18px]", "rounded-md", "py-[10px]");
  });

  it("renders button with custom text", () => {
    render(<Button>Custom Button</Button>);

    expect(screen.getByText("Custom Button")).toBeInTheDocument();
  });

  it("applies primary variant", () => {
    render(<Button variant="primary">Primary Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "bg-[var(--bg-primary)]",
      "text-[var(--primary-foreground)]",
    );
  });

  it("applies destructive variant", () => {
    render(<Button variant="destructive">Destructive Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-destructive", "text-destructive-foreground");
  });

  it("applies outline variant", () => {
    render(<Button variant="outline">Outline Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("border", "border-[var(--color-input)]");
  });

  it("applies secondary variant", () => {
    render(<Button variant="secondary">Secondary Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-secondary", "text-secondary-foreground");
  });

  it("applies ghost variant", () => {
    render(<Button variant="ghost">Ghost Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "hover:bg-accent",
      "hover:text-accent-foreground",
    );
  });

  it("applies link variant", () => {
    render(<Button variant="link">Link Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-primary", "underline-offset-4");
  });

  it("applies small size", () => {
    render(<Button size="sm">Small Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-9", "rounded-md", "px-3");
  });

  it("applies large size", () => {
    render(<Button size="lg">Large Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-11", "rounded-md", "px-8");
  });

  it("applies icon size", () => {
    render(<Button size="icon">Icon Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-10", "w-10");
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("handles disabled state", () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass(
      "disabled:pointer-events-none",
      "disabled:opacity-50",
    );
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<Button ref={ref}>Button with ref</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("renders as child when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>,
    );

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
  });

  it("passes through additional props", () => {
    render(
      <Button data-testid="test-button" type="submit">
        Submit Button
      </Button>,
    );

    const button = screen.getByTestId("test-button");
    expect(button).toHaveAttribute("type", "submit");
  });

  it("applies multiple variants and sizes", () => {
    render(
      <Button variant="primary" size="lg" className="custom">
        Multi-variant Button
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "bg-[var(--bg-primary)]",
      "text-[var(--primary-foreground)]",
      "h-11",
      "px-8",
      "custom",
    );
  });
});
