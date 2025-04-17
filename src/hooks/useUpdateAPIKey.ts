import { request } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateAPIPayload {
  id: string;
  name: string;
  projectId: string;
}

const updateAPIKey = (data: UpdateAPIPayload) => {
  return request.apiKeys.updateAPIKey({
    data: { appName: data.name },
    query: data.id,
  });
};

export const useUpdateAPIKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateAPIKey"],
    mutationFn: updateAPIKey,
    onSettled: (_, __, data) => {
      return queryClient.refetchQueries({
        queryKey: ["apikeys", { projectId: data.projectId }],
      });
    },
  });
};
