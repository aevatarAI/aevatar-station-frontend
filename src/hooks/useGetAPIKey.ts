import { request } from "@/api"
import { useQuery } from "@tanstack/react-query"

export const useGetAPIKeys = (projectId: string) => {
    return useQuery({
      queryKey: ['apikeys', { projectId }],
      queryFn: () => {
        return request.apiKeys.getAPIKeys({query: projectId})
      }
    })
  }