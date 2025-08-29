import {
  accessTokenAtom,
  projectInitialisingAtom,
  refreshTokenAtom,
} from "@/state/atoms";
import { DLL_LIST_ATOM, RESTART_POD_SERVER_ATOM } from "@/state/atoms/dll";
import {
  CURRENT_ORGANIZATION_ATOM,
  CURRENT_ORGANIZATION_ROLE_ATOM,
  CURRENT_PROJECT_ATOM,
  CURRENT_PROJECT_ROLE_ATOM,
  ORGANIZATIONS_LIST_ATOM,
  ORGANIZATION_MEMBER_ATOM,
  PROJECT_LIST_ATOM,
} from "@/state/atoms/organisation";
import {
  ORGANIZATION_PERMISSION_ATOM,
  PROJECT_PERMISSION_ATOM,
} from "@/state/atoms/permissions";
import { USER_LOGIN_TYPE, USER_PROFILE_ATOM } from "@/state/atoms/profile";
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useLogout } from "./useLogout";

// Mock React hooks
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useCallback: vi.fn((fn) => fn),
  };
});

// Mock jotai
vi.mock("jotai", () => ({
  useAtom: vi.fn(),
  atom: vi.fn(),
}));

describe("useLogout Hook", () => {
  const mockSetters: any[] = [];
  const atomNames = [
    ORGANIZATIONS_LIST_ATOM,
    PROJECT_LIST_ATOM,
    CURRENT_ORGANIZATION_ATOM,
    CURRENT_PROJECT_ATOM,
    accessTokenAtom,
    refreshTokenAtom,
    USER_PROFILE_ATOM,
    PROJECT_PERMISSION_ATOM,
    ORGANIZATION_PERMISSION_ATOM,
    CURRENT_PROJECT_ROLE_ATOM,
    CURRENT_ORGANIZATION_ROLE_ATOM,
    ORGANIZATION_MEMBER_ATOM,
    USER_LOGIN_TYPE,
    DLL_LIST_ATOM,
    RESTART_POD_SERVER_ATOM,
    projectInitialisingAtom,
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock setters
    mockSetters.length = 0;
    for (let i = 0; i < atomNames.length; i++) {
      mockSetters.push(vi.fn());
    }

    // Mock useAtom to return our mock setters
    vi.mocked(useAtom).mockImplementation((atom) => {
      const index = atomNames.indexOf(atom);
      if (index !== -1) {
        return [undefined, mockSetters[index]];
      }
      // For atoms not in our list, return a mock setter
      return [undefined, vi.fn()];
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should reset all atoms when logout is called", () => {
    const logout = useLogout();
    logout();

    // Verify that resetMock was called for each atom
    // Note: setProjectRole is called twice (once in function body, once in dependencies)
    expect(mockSetters[0]).toHaveBeenCalledWith(RESET); // setOrganizationsList
    expect(mockSetters[1]).toHaveBeenCalledWith(RESET); // setProjectList
    expect(mockSetters[2]).toHaveBeenCalledWith(RESET); // setProjectRoleList
    expect(mockSetters[3]).toHaveBeenCalledWith(RESET); // setCurrentOrganization
    expect(mockSetters[4]).toHaveBeenCalledWith(RESET); // setCurrentProject
    expect(mockSetters[5]).toHaveBeenCalledWith(RESET); // setProjectRole
    expect(mockSetters[6]).toHaveBeenCalledWith(RESET); // setDllList
    expect(mockSetters[7]).toHaveBeenCalledWith(RESET); // setRestartPodServer
    expect(mockSetters[8]).toHaveBeenCalledWith(RESET); // setUser
    expect(mockSetters[9]).toHaveBeenCalledWith(RESET); // setUserProfile
    expect(mockSetters[10]).toHaveBeenCalledWith(RESET); // setProjectInitialising
  });

  it("should reset each individual atom with RESET value", () => {
    const logout = useLogout();
    logout();

    // Verify that each setter was called with RESET
    // Note: setProjectRole is called once
    mockSetters.forEach((setter, index) => {
      expect(setter).toHaveBeenCalledWith(RESET);
      if (index === 5) {
        // setProjectRole index
        expect(setter).toHaveBeenCalledTimes(1);
      } else {
        expect(setter).toHaveBeenCalledTimes(1);
      }
    });
  });

  it("should return a function that can be called multiple times", () => {
    const logout = useLogout();

    // Call logout multiple times
    logout();
    logout();
    logout();

    // Each setter should be called the expected number of times
    mockSetters.forEach((setter, index) => {
      if (index === 5) {
        // setProjectRole index
        expect(setter).toHaveBeenCalledTimes(3); // 1 call per logout * 3 logouts
      } else {
        expect(setter).toHaveBeenCalledTimes(3); // 1 call per logout * 3 logouts
      }
    });
  });
});
