import { request } from "@/api"
import { useToast } from "@/hooks/use-toast"
import { CURRENT_ORGANIZATION_ATOM } from "@/state/atoms/organisation"
import { useMutation } from "@tanstack/react-query"
import { useAtom } from "jotai"

export const useUpdateOrganisationName = () => {
    const { toast } = useToast();
    const [orgId] = useAtom(CURRENT_ORGANIZATION_ATOM);

    return useMutation({
        mutationKey: ["organisation", { orgId }],
        mutationFn: (displayName: string) => {
            return request.organizations.editOrganization({
                query: orgId as string,
                data: {
                    displayName
                }
            })
        },
        onSuccess: () => {
            toast({ description: "successfully updated" });
        },
        onError: () => {
            toast({ description: "error updating" });
        }
    })
}