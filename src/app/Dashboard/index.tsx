import { service } from "@/api/axios";
import ApiKeys from "@/components/ApiKeys";
import DllPage from "@/components/DllPage";
import GAgents from "@/components/GAgents";
import ProjectInitialising from "@/components/ProjectInitialising";
import { SideBar } from "@/components/SideBar";
import { Usage } from "@/components/Usage";
import WorkflowPage from "@/components/WorkflowPage";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useNavigate } from "@/hooks/navigate";
import { useAevatarConfig } from "@/hooks/useAevatarConfig";
import { useCheckProjectService } from "@/hooks/useCheckProjectService";
import { useCloseDialog } from "@/hooks/useCloseDialog";
import { useCurrentProject } from "@/hooks/useCurrentProject";
import { useSideBarParams } from "@/hooks/useSideBarParams";
import { useUpdateOrganisations } from "@/hooks/useUpdateOrganisations";
import { projectInitialisingAtom } from "@/state/atoms";
import { DialogClose } from "@radix-ui/react-dialog";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef } from "react";

function Dashboard() {
  useUpdateOrganisations();
  const [, selectTab] = useSideBarParams();
  const { ref, handleClose } = useCloseDialog();

  useAevatarConfig();

  return (
    <>
      {/* Fixed sidebar for desktop - full viewport height */}
      <div className="hidden lg:block w-[200px] bg-[#191919] min-w-[200px] h-full sticky top-0">
        <SideBar onClose={handleClose} />
      </div>

      {/* Mobile drawer/sheet */}
      <Sheet>
        <SheetContent className="lg:hidden w-[200px] bg-[#191919]">
          <DialogClose ref={ref} />
          <SideBar onClose={handleClose} />
        </SheetContent>
      </Sheet>

      {/* Scrollable main content */}
      <div className="flex-1 overflow-auto h-full bg-black">
        <div
          className={clsx(
            " h-full",
            selectTab !== "workflows" && "pt-[31px] px-[20px] ",
          )}
        >
          {selectTab === "apikeys" && <ApiKeys />}
          {selectTab === "usage" && <Usage />}
          {selectTab === "g-agents" && <GAgents />}
          {selectTab === "workflows" && <WorkflowPage />}
          {selectTab === "configuration" && <DllPage />}
        </div>
      </div>
    </>
  );
}

export default function DashboardWrapper() {
  const checkProjectService = useCheckProjectService();
  const currentProject = useCurrentProject();
  const [projectInitialising, setProjectInitialising] = useAtom(
    projectInitialisingAtom,
  );

  const navigate = useNavigate();

  const isProjectInit = useMemo(() => {
    if (!currentProject?.id) {
      navigate("/profile/organisation/project");
      return false;
    }
    return projectInitialising?.includes(currentProject.id);
  }, [currentProject, navigate, projectInitialising]);

  const [, selectTab] = useSideBarParams();

  const isDestroyed = useRef(false);

  useEffect(() => {
    return () => {
      isDestroyed.current = true;
    };
  }, []);

  const checkCurrentProjectService = useCallback(async () => {
    if (!currentProject?.domainName) {
      navigate("/profile/organisation/project");
      return;
    }
    await checkProjectService(currentProject?.domainName);

    setProjectInitialising((prev) => {
      const newArray = [...(prev ?? [])];
      if (!newArray.includes(currentProject.id)) {
        newArray.push(currentProject.id);
      }
      return newArray;
    });
    if (isDestroyed.current) {
      return;
    }
    navigate(`/dashboard/${selectTab ?? "workflows"}${location.search ?? ""}`);
  }, [
    checkProjectService,
    navigate,
    currentProject,
    selectTab,
    setProjectInitialising,
  ]);

  useEffect(() => {
    if (!isProjectInit) {
      console.log("checkCurrentProjectService");
      checkCurrentProjectService();
    }
  }, [isProjectInit, checkCurrentProjectService]);

  return (
    <div className="flex h-[calc(100vh-60px)] overflow-auto ">
      {!isProjectInit && <ProjectInitialising />}

      {isProjectInit && <Dashboard />}
    </div>
  );
}
