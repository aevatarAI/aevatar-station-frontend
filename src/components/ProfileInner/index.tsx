import { request } from "@/api";
import General from "@/components/General";
import Notifications from "@/components/Notifications";
import type { TAB_LIST } from "@/constants/sideBar";
import { useToast } from "@/hooks/use-toast";
import { handleErrorMessage, sleep } from "@etransfer/utils";
import { useCallback } from "react";

interface IProfileInnerProps {
  tab: (typeof TAB_LIST)[number];
}
export default function ProfileInner({ tab }: IProfileInnerProps) {
  const { toast } = useToast();
  const onNameSave = useCallback(
    async (userName: string) => {
      try {
        await sleep(2000);
        await request.profile.editProfile({
          params: {
            userName,
          },
        });
        toast({
          description: "Successfully",
        });
      } catch (error) {
        toast({
          description: handleErrorMessage(error, "Error: save name"),
        });
      }
    },
    [toast]
  );
  return (
    <div>
      {tab === "general" && (
        <General
          header="profile"
          title={"name"}
          inputPlaceholder="name"
          buttonProps={{ placement: "top-right" }}
          onConfirm={onNameSave}
        />
      )}
      {tab === "notifications" && <Notifications />}
    </div>
  );
}
