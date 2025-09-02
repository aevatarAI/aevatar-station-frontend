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
import { aevatarAI } from "@aevatar-react-sdk/ui-react";
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";
import { useCallback } from "react";

export const useLogout = () => {
  const [, setOrganizationsList] = useAtom(ORGANIZATIONS_LIST_ATOM);
  const [, setCurrentOrganization] = useAtom(CURRENT_ORGANIZATION_ATOM);
  const [, setProjectList] = useAtom(PROJECT_LIST_ATOM);
  const [, setCurrentProject] = useAtom(CURRENT_PROJECT_ATOM);
  const [, setAccessToken] = useAtom(accessTokenAtom);
  const [, setRefreshToken] = useAtom(refreshTokenAtom);

  const [, setProfile] = useAtom(USER_PROFILE_ATOM);
  const [, setPermission] = useAtom(PROJECT_PERMISSION_ATOM);
  const [, setOrgPermission] = useAtom(ORGANIZATION_PERMISSION_ATOM);

  const [, setProjectRole] = useAtom(CURRENT_PROJECT_ROLE_ATOM);
  const [, setOrgRole] = useAtom(CURRENT_ORGANIZATION_ROLE_ATOM);
  const [, setOrgMember] = useAtom(ORGANIZATION_MEMBER_ATOM);
  const [, setUserLoginType] = useAtom(USER_LOGIN_TYPE);
  const [, setDllListType] = useAtom(DLL_LIST_ATOM);
  const [, setRestartPodServer] = useAtom(RESTART_POD_SERVER_ATOM);
  const [, setProjectInitialising] = useAtom(projectInitialisingAtom);
  return useCallback(() => {
    setOrganizationsList(RESET);
    setProjectList(RESET);
    setCurrentOrganization(RESET);
    setCurrentProject(RESET);
    setAccessToken(RESET);
    setRefreshToken(RESET);
    setOrgMember(RESET);

    setPermission(RESET);
    setProjectRole(RESET);
    setOrgRole(RESET);
    setProfile(RESET);
    setOrgPermission(RESET);
    setUserLoginType(RESET);
    setDllListType(RESET);
    setRestartPodServer(RESET);
    setProjectInitialising(RESET);
    aevatarAI.fetchRequest.setHeaders({
      Authorization: "",
    });
  }, [
    setOrganizationsList,
    setProjectList,
    setCurrentOrganization,
    setCurrentProject,
    setAccessToken,
    setRefreshToken,
    setProfile,
    setOrgRole,
    setOrgMember,
    setPermission,
    setProjectRole,
    setOrgPermission,
    setUserLoginType,
    setDllListType,
    setRestartPodServer,
    setProjectInitialising,
  ]);
};
