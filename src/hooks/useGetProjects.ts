import { request } from "@/api"
import { CURRENT_ORGANIZATION_ATOM } from "@/state/atoms/organisation"
import { useQuery } from "@tanstack/react-query"
import { useAtom } from "jotai"


export const useGetProjects = () => {
    const [organizationId] = useAtom(CURRENT_ORGANIZATION_ATOM);

    return useQuery({
        queryKey: ["projects", { organizationId }],
        queryFn: () => {
            return request.projects.getUserProject({
                params: {
                    organizationId
                }
            })
        },
        enabled: !!organizationId
    })
}