import ApiKeys from "@/components/ApiKeys";
import DllPage from "@/components/DllPage";
import { SideBar } from "@/components/SideBar";
import { Usage } from "@/components/Usage";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useCloseDialog } from "@/hooks/useCloseDialog";
import { useSideBarParams } from "@/hooks/useSideBarParams";
import { useUpdateOrganisations } from "@/hooks/useUpdateOrganisations";
import { DialogClose } from "@radix-ui/react-dialog";

export default function Dashboard() {
  useUpdateOrganisations();
  const [, selectTab] = useSideBarParams();
  const { ref, handleClose } = useCloseDialog();
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Fixed sidebar for desktop - full viewport height */}
      <div className="hidden lg:block w-[200px] bg-[#191919] min-w-[200px] h-screen sticky top-0">
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
      <div className="flex-1 overflow-auto h-screen bg-black">
        <div className="pt-[31px] px-[20px]">
          {selectTab === "apikeys" && <ApiKeys />}
          {selectTab === "usage" && <Usage />}
          {selectTab === "dll" && <DllPage />}
        </div>
      </div>
    </div>
  );
}
