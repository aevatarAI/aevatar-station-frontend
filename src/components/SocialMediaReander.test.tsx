import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import socialMediaReander from "./SocialMediaReander";

describe("SocialMediaReander", () => {
  it("renders all social media links", () => {
    const { container } = render(socialMediaReander(""));

    expect(screen.getByText("Website")).toBeInTheDocument();
    expect(screen.getByText("Github")).toBeInTheDocument();
    expect(screen.getByText("Docs")).toBeInTheDocument();
  });

  it("renders links with correct href attributes", () => {
    render(socialMediaReander(""));

    const websiteLink = screen.getByText("Website");
    const githubLink = screen.getByText("Github");
    const docsLink = screen.getByText("Docs");

    expect(websiteLink).toHaveAttribute("href", "https://aevatar.ai");
    expect(githubLink).toHaveAttribute("href", "https://github.com/aevatarAI");
    expect(docsLink).toHaveAttribute(
      "href",
      "https://aevatar.ai/aevatar.ai_whitepaper_v0.1.pdf",
    );
  });

  it("renders links with correct target and rel attributes", () => {
    render(socialMediaReander(""));

    const links = screen.getAllByRole("link");

    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    });
  });

  it("applies custom className", () => {
    const customClass = "custom-class";
    const { container } = render(socialMediaReander(customClass));

    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveClass("flex", "justify-between", customClass);
  });

  it("applies default classes", () => {
    const { container } = render(socialMediaReander(""));

    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveClass("flex", "justify-between");
  });

  it("applies correct styles to links", () => {
    render(socialMediaReander(""));

    const links = screen.getAllByRole("link");

    links.forEach((link) => {
      expect(link).toHaveClass(
        "text-[var(--muted-foreground)]",
        "font-outfit",
        "text-[16px]",
        "font-semibold",
        "leading-normal",
      );
    });
  });

  it("renders without className", () => {
    const { container } = render(socialMediaReander(""));

    expect(screen.getByText("Website")).toBeInTheDocument();
    expect(screen.getByText("Github")).toBeInTheDocument();
    expect(screen.getByText("Docs")).toBeInTheDocument();

    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveClass("flex", "justify-between");
  });
});
