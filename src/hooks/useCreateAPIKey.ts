import { request } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateAPIPayload {
    projectId: string;
    keyName: string;
  }
  
const createAPIKey = (data: CreateAPIPayload) => {
    return request.apiKeys.createAPIKey({ data })
}
  
export const useCreateAPIKey = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationKey: ['createAPIKey'],
      mutationFn: createAPIKey,
      onSettled: (_, __, data) => {      
        return queryClient.refetchQueries({
          queryKey: ['apikeys', { projectId: data.projectId }],
        });
      }
    })
  }