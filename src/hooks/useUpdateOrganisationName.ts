import { request } from "@/api";
import { useToast } from "@/hooks/use-toast";
import { CURRENT_ORGANIZATION_ATOM } from "@/state/atoms/organisation";
import { handleErrorMessage } from "@/utils/error";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";

export const useUpdateOrganisationName = () => {
  const { toast } = useToast();
  const [orgId] = useAtom(CURRENT_ORGANIZATION_ATOM);

  return useMutation({
    mutationKey: ["organisation", { orgId }],
    mutationFn: async (displayName: string) => {
      try {
        const result = await request.organizations.editOrganization({
          query: orgId as string,
          data: {
            displayName,
          },
        });
        toast({ description: "Successfully saved" });

        return result;
      } catch (error) {
        toast({ description: handleErrorMessage(error, "Error updating") });
      }
    },
  });
};
