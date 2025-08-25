import { request } from "@/api";
import { useNavigate } from "@/hooks/navigate";
import { useEmail } from "@/hooks/useEmail";
import { useQuery } from "@tanstack/react-query";

export const useGetOrganizations = () => {
  const navigate = useNavigate();
  const email = useEmail();

  return useQuery({
    queryKey: ["organisation", { email }],
    queryFn: async () => {
      try {
        const response = await request.organizations.getUserOrganizations();
        return response;
      } catch (_) {
        navigate("/welcome");
        return null;
      }
    },
    enabled: !!email,
  });
};
