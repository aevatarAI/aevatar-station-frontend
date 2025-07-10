import { service } from "@/api/axios";
import ApiKeys from "@/components/ApiKeys";
import DllPage from "@/components/DllPage";
import GAgents from "@/components/GAgents";
import { SideBar } from "@/components/SideBar";
import { Usage } from "@/components/Usage";
import WorkflowPage from "@/components/WorkflowPage";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAevatarConfig } from "@/hooks/useAevatarConfig";
import { useCloseDialog } from "@/hooks/useCloseDialog";
import { useSideBarParams } from "@/hooks/useSideBarParams";
import { useUpdateOrganisations } from "@/hooks/useUpdateOrganisations";
import { DialogClose } from "@radix-ui/react-dialog";
import clsx from "clsx";

export default function Dashboard() {
  useUpdateOrganisations();
  const [, selectTab] = useSideBarParams();
  const { ref, handleClose } = useCloseDialog();

  useAevatarConfig();

  return (
    <div className="flex h-[calc(100vh-60px)] overflow-auto">
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
    </div>
  );
}
