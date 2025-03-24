import { request } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DeleteAPIPayload {
    projectId: string;
    apiKeyId: string;
  }
  
const deleteAPIKey = (data: DeleteAPIPayload) => {
    return request.apiKeys.deleteAPIKey({ query: data.projectId })
}
  
export const useDeleteAPIKey = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationKey: ['deleteAPIKey'],
      mutationFn: deleteAPIKey,
      onSettled: (_, __, data) => {
        return queryClient.refetchQueries({
          queryKey: ['apikeys', { projectId: data.projectId }]
        })
      }
    })
  }