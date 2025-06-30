import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Copy from "./index";

// Mock SVG dependencies
vi.mock("@/assets/tick.svg?react", () => ({
  default: () => <div data-testid="tick-icon" />,
}));
vi.mock("@/assets/to_copy.svg?react", () => ({
  default: (props: any) => <div data-testid="copy-icon" {...props} />,
}));
// Mock toast
vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
}));
// Mock useCopyToClipboard
vi.mock("react-use", () => ({
  useCopyToClipboard: () => [null, vi.fn()],
}));

describe("Copy Component", () => {
  beforeEach(() => {
    cleanup();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Positive: renders CopyIcon and shows TickIcon after click", () => {
    const { getByTestId, queryByTestId } = render(
      <Copy toCopy="hello">Copy</Copy>,
    );
    expect(getByTestId("copy-icon")).toBeTruthy();
    expect(queryByTestId("tick-icon")).toBeNull();
    fireEvent.click(getByTestId("copy-icon"));
    expect(getByTestId("tick-icon")).toBeTruthy();
  });

  it("Positive: supports custom className and iconClassName", () => {
    const { getByTestId } = render(
      <Copy toCopy="hi" className="my-class" iconClassName="icon-cls">
        Content
      </Copy>,
    );
    const span = getByTestId("copy-span");
    expect(span.className).toContain("my-class");
    expect(getByTestId("copy-icon").className).toContain("icon-cls");
  });

  it("Boundary: empty children", () => {
    const { getByTestId } = render(<Copy toCopy="hi" />);
    expect(getByTestId("copy-icon")).toBeTruthy();
  });

  it("Exception: empty string toCopy", () => {
    const { getByTestId } = render(<Copy toCopy="" />);
    expect(getByTestId("copy-icon")).toBeTruthy();
    fireEvent.click(getByTestId("copy-icon"));
    expect(getByTestId("tick-icon")).toBeTruthy();
  });

  it("Exception: empty/undefined description", () => {
    const { getByTestId } = render(
      <Copy toCopy="hi" description={undefined} />,
    );
    fireEvent.click(getByTestId("copy-icon"));
    expect(getByTestId("tick-icon")).toBeTruthy();
  });

  it("Interaction: supports keyboard Enter/Space to trigger copy", () => {
    const { getByTestId } = render(<Copy toCopy="hi" />);
    const icon = getByTestId("copy-icon");
    // biome-ignore lint/style/noNonNullAssertion: test environment
    fireEvent.keyDown(icon.parentElement!, { key: "Enter" });
    expect(getByTestId("tick-icon")).toBeTruthy();
    cleanup();
    const { getByTestId: getByTestId2 } = render(<Copy toCopy="hi" />);
    // biome-ignore lint/style/noNonNullAssertion: test environment
    fireEvent.keyDown(getByTestId2("copy-icon").parentElement!, { key: " " });
    expect(getByTestId2("tick-icon")).toBeTruthy();
  });

  it("Exception: null/undefined className", () => {
    const { getByTestId: getByTestId1, unmount } = render(
      <Copy toCopy="hi" className={""} />,
    );
    const span1 = getByTestId1("copy-span");
    expect(span1.className).toContain("flex-row-center");
    unmount();
    // undefined
    const { getByTestId: getByTestId2 } = render(
      <Copy toCopy="hi" className={undefined} />,
    );
    const span2 = getByTestId2("copy-span");
    expect(span2.className).toContain("flex-row-center");
  });
});
