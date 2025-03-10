import General from "@/components/General";
import ProjectMember from "@/components/ProjectMember";
import type { TAB_LIST } from "@/constants/sideBar";
import { sleep } from "@etransfer/utils";
import { useCallback } from "react";

interface IOrganisationInnerProps {
  tab: (typeof TAB_LIST)[number];
}
const ProjectsInner = ({ tab }: IOrganisationInnerProps) => {
  const onNameSave = useCallback(async () => {
    await sleep(2000);
  }, []);
  return (
    <div>
      {tab === "general" && (
        <General
          header="project settings"
          title={"project name"}
          inputPlaceholder="name"
          buttonProps={{ placement: "bottom-left" }}
          onConfirm={onNameSave}
        />
      )}
      {tab === "member" && <ProjectMember />}
      {tab === "role" && <div>role</div>}
    </div>
  );
};
export default ProjectsInner;
