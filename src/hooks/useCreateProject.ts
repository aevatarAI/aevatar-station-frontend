import { request } from "@/api";
import { useToast } from "@/hooks/use-toast";
import { CURRENT_ORGANIZATION_ATOM } from "@/state/atoms/organisation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useCallback } from "react";
interface CreateProjectPayload {
  organizationId: string;
  displayName: string;
  domainName: string;
}

export const useCreateProject = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [organizationId] = useAtom(CURRENT_ORGANIZATION_ATOM);

  return useMutation({
    mutationKey: ["project", { organizationId }],
    mutationFn: (data: CreateProjectPayload) => {
      return request.projects.addProject({ data });
    },
    onError: (error) => {
      console.error(error);
      toast({ description: "Unable to create project" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects", { organizationId }],
      });
    },
  });
};

export const useCreateProjectHandler = () => {
  const [organizationId] = useAtom(CURRENT_ORGANIZATION_ATOM);
  const queryClient = useQueryClient();

  return useCallback(
    async (data: CreateProjectPayload) => {
      const result = await request.projects.addProject({ data });
      queryClient.invalidateQueries({
        queryKey: ["projects", { organizationId }],
      });
      return result();
    },
    [organizationId, queryClient],
  );
};
