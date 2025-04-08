import ApiKeys from "@/components/ApiKeys";
import { SideBar } from "@/components/SideBar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useCloseDialog } from "@/hooks/useCloseDialog";
import { useSideBarParams } from "@/hooks/useSideBarParams";
import { useUpdateOrganisations } from "@/hooks/useUpdateOrganisations";
import { DialogClose } from "@radix-ui/react-dialog";

export default function Dashboard() {
  const [, selectTab] = useSideBarParams();
  const { ref, handleClose } = useCloseDialog();
  // TODO
  useUpdateOrganisations();
  return (
    <Sheet>
      <SheetContent className="hidden lg:block w-[200px]  bg-[#191919] min-w-[200px]">
        <DialogClose className="hidden" ref={ref}/>
        <SideBar onClose={handleClose}/>
      </SheetContent>
      <div className="pt-[31px] px-[20px] flex-1 overflow-auto">
        {selectTab === "apikeys" && <ApiKeys />}
      </div>
    </Sheet>
  );
}
