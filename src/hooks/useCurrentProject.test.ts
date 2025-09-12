import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCurrentProject } from "./useCurrentProject";

// Mock dependencies
vi.mock("jotai", () => ({
  useAtom: vi.fn(),
}));

vi.mock("react", () => ({
  useMemo: vi.fn((fn, deps) => fn()),
}));

import { useAtom } from "jotai";

const mockUseAtom = vi.mocked(useAtom);

describe("useCurrentProject", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null when projectList is not an array", () => {
    mockUseAtom
      .mockReturnValueOnce(["project-1", vi.fn()]) // projectId
      .mockReturnValueOnce([null, vi.fn()]); // projectList

    const result = useCurrentProject();

    expect(result).toBeNull();
  });

  it("should return null when projectList is undefined", () => {
    mockUseAtom
      .mockReturnValueOnce(["project-1", vi.fn()]) // projectId
      .mockReturnValueOnce([undefined, vi.fn()]); // projectList

    const result = useCurrentProject();

    expect(result).toBeNull();
  });

  it("should return null when projectList is empty array", () => {
    mockUseAtom
      .mockReturnValueOnce(["project-1", vi.fn()]) // projectId
      .mockReturnValueOnce([[], vi.fn()]); // projectList

    const result = useCurrentProject();

    expect(result).toBeNull();
  });

  it("should return project when found in projectList", () => {
    const projectId = "project-1";
    const projectList = [
      { id: "project-1", name: "Project 1", description: "First project" },
      { id: "project-2", name: "Project 2", description: "Second project" },
    ];

    mockUseAtom
      .mockReturnValueOnce([projectId, vi.fn()]) // projectId
      .mockReturnValueOnce([projectList, vi.fn()]); // projectList

    const result = useCurrentProject();

    expect(result).toEqual({
      id: "project-1",
      name: "Project 1",
      description: "First project",
    });
  });

  it("should return null when project not found in projectList", () => {
    const projectId = "project-3";
    const projectList = [
      { id: "project-1", name: "Project 1", description: "First project" },
      { id: "project-2", name: "Project 2", description: "Second project" },
    ];

    mockUseAtom
      .mockReturnValueOnce([projectId, vi.fn()]) // projectId
      .mockReturnValueOnce([projectList, vi.fn()]); // projectList

    const result = useCurrentProject();

    expect(result).toBeNull();
  });

  it("should return null when projectId is null", () => {
    const projectList = [
      { id: "project-1", name: "Project 1", description: "First project" },
    ];

    mockUseAtom
      .mockReturnValueOnce([null, vi.fn()]) // projectId
      .mockReturnValueOnce([projectList, vi.fn()]); // projectList

    const result = useCurrentProject();

    expect(result).toBeNull();
  });

  it("should return null when projectId is undefined", () => {
    const projectList = [
      { id: "project-1", name: "Project 1", description: "First project" },
    ];

    mockUseAtom
      .mockReturnValueOnce([undefined, vi.fn()]) // projectId
      .mockReturnValueOnce([projectList, vi.fn()]); // projectList

    const result = useCurrentProject();

    expect(result).toBeNull();
  });

  it("should return project with additional properties", () => {
    const projectId = "project-1";
    const projectList = [
      {
        id: "project-1",
        name: "Project 1",
        description: "First project",
        status: "active",
        createdAt: "2023-01-01",
      },
    ];

    mockUseAtom
      .mockReturnValueOnce([projectId, vi.fn()]) // projectId
      .mockReturnValueOnce([projectList, vi.fn()]); // projectList

    const result = useCurrentProject();

    expect(result).toEqual({
      id: "project-1",
      name: "Project 1",
      description: "First project",
      status: "active",
      createdAt: "2023-01-01",
    });
  });

  it("should handle multiple projects in list", () => {
    const projectId = "project-2";
    const projectList = [
      { id: "project-1", name: "Project 1" },
      { id: "project-2", name: "Project 2" },
      { id: "project-3", name: "Project 3" },
    ];

    mockUseAtom
      .mockReturnValueOnce([projectId, vi.fn()]) // projectId
      .mockReturnValueOnce([projectList, vi.fn()]); // projectList

    const result = useCurrentProject();

    expect(result).toEqual({
      id: "project-2",
      name: "Project 2",
    });
  });
});
