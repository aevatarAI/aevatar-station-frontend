import General from "@/components/General";
import Notications from "@/components/Notications";
import type { TAB_LIST } from "@/constants/sideBar";
import { sleep } from "@etransfer/utils";
import { useCallback } from "react";

interface IProfileInnerProps {
  tab: (typeof TAB_LIST)[number];
}
export default function ProfileInner({ tab }: IProfileInnerProps) {
  const onNameSave = useCallback(async () => {
    await sleep(2000);
  }, []);
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
      {tab === "notications" && <Notications />}
    </div>
  );
}
