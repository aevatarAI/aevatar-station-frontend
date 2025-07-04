import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CardLoading from "./index";

// Mock SVG
vi.mock("../../assets/loading.svg?react", () => ({
  __esModule: true,
  default: ({ className }: { className?: string }) => (
    <div data-testid="loading-icon" className={className} />
  ),
}));

describe("CardLoading Component", () => {
  it("should render correctly and contain loading icon", () => {
    const { getByTestId } = render(<CardLoading />);
    const loadingDiv = getByTestId("card-loading");
    expect(loadingDiv).toBeTruthy();
    // Check if mocked loading-icon renders
    expect(getByTestId("loading-icon")).toBeTruthy();
  });

  it("should support custom className", () => {
    const { getByTestId } = render(<CardLoading className="custom-class" />);
    const loadingDiv = getByTestId("card-loading");
    expect(loadingDiv.className).toContain("custom-class");
  });

  it("boundary case: className is empty string", () => {
    const { getByTestId } = render(<CardLoading className="" />);
    const loadingDiv = getByTestId("card-loading");
    expect(loadingDiv.className).toContain("flex");
  });

  it("error case: className is null/undefined", () => {
    // @ts-expect-error testing exception parameters
    const { getByTestId: getByTestId1, unmount } = render(
      <CardLoading className={null} />,
    );
    const loadingDiv1 = getByTestId1("card-loading");
    expect(loadingDiv1.className).toContain("flex");
    unmount();
    // undefined case
    const { getByTestId: getByTestId2 } = render(
      <CardLoading className={undefined} />,
    );
    const loadingDiv2 = getByTestId2("card-loading");
    expect(loadingDiv2.className).toContain("flex");
  });

  // Async/Mock scenario: no async logic or external dependencies, no mock needed
});
