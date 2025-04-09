import { request } from "@/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface CreateProjectPayload {
    organizationId: string;
    displayName: string;
    domainName: string;
}

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["project"],
        mutationFn: (data: CreateProjectPayload) => {
            return request.projects.addProject({ data })
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] })
        }
    })
}