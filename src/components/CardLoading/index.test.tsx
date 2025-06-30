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

describe("CardLoading 组件", () => {
  it("应正确渲染并包含 loading 图标", () => {
    const { getByTestId } = render(<CardLoading />);
    const loadingDiv = getByTestId("card-loading");
    expect(loadingDiv).toBeTruthy();
    // 检查mock的loading-icon是否渲染
    expect(getByTestId("loading-icon")).toBeTruthy();
  });

  it("应支持自定义 className", () => {
    const { getByTestId } = render(<CardLoading className="custom-class" />);
    const loadingDiv = getByTestId("card-loading");
    expect(loadingDiv.className).toContain("custom-class");
  });

  it("边界情况：className 为空字符串", () => {
    const { getByTestId } = render(<CardLoading className="" />);
    const loadingDiv = getByTestId("card-loading");
    expect(loadingDiv.className).toContain("flex");
  });

  it("异常情况：className 为 null/undefined", () => {
    // @ts-expect-error 测试异常传参
    const { getByTestId: getByTestId1, unmount } = render(
      <CardLoading className={null} />,
    );
    const loadingDiv1 = getByTestId1("card-loading");
    expect(loadingDiv1.className).toContain("flex");
    unmount();
    // undefined 情况
    const { getByTestId: getByTestId2 } = render(
      <CardLoading className={undefined} />,
    );
    const loadingDiv2 = getByTestId2("card-loading");
    expect(loadingDiv2.className).toContain("flex");
  });

  // 异步/Mock场景：无异步逻辑与外部依赖，无需Mock
});
