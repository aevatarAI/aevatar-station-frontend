import { request } from "@/api"
import { useToast } from "@/hooks/use-toast";
import { CURRENT_ORGANIZATION_ATOM } from "@/state/atoms/organisation";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAtom } from "jotai";

interface EditProjectPayload {
    id: string;
    organizationId: string;
    displayName: string;
    domainName: string;
}

export const useEditProject = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [organizationId] = useAtom(CURRENT_ORGANIZATION_ATOM);

    return useMutation({
        mutationKey: ["project", { organizationId }],
        mutationFn: (data: EditProjectPayload) => {
            return request.projects.editProject({ query: data.id, data })
        },
        onError: (error) => {
            console.error(error)
            toast({ description: "unable to edit project" });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", { organizationId }] })
        }
    })
}