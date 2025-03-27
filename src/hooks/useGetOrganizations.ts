import { request } from "@/api"
import { useEmail } from "@/hooks/useEmail"
import { useQuery } from "@tanstack/react-query"

export const useGetOrganizations = () => {
    const email = useEmail();

    return useQuery({
        queryKey: ['organisation', { email }],
        queryFn: request.organizations.getUserOrganizations,
        enabled: !!email
    })
}