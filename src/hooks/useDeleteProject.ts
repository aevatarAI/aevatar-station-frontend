import { request } from "@/api"
import { useToast } from "@/hooks/use-toast";
import { CURRENT_ORGANIZATION_ATOM } from "@/state/atoms/organisation";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAtom } from "jotai";

export const useDeleteProject = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [organizationId] = useAtom(CURRENT_ORGANIZATION_ATOM);

    return useMutation({
        mutationKey: ["project", { organizationId }],
        mutationFn: (id: string) => {
            return request.projects.deleteProject({ query: id })
        },
        onError: (error) => {
            console.error(error);
            toast({ description: "unable to delete project" });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", { organizationId }] })
        }
    })
}