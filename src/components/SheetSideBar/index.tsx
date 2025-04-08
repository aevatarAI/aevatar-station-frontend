"use client";

import Menu from "@/assets/menu.svg?react";
import { SideBar } from "@/components/SideBar";
import { DialogClose, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCloseDialog } from "@/hooks/useCloseDialog";

export function SheetSideBar() {
  const { ref, handleClose } = useCloseDialog();

  return (
    <Sheet key={"left"}>
      <SheetTrigger asChild>
        <Menu className="lg:hidden cursor-pointer" />
      </SheetTrigger>
      <SheetContent
        side="left"
        closable={false}
        className="w-[200px] pt-[35px] p-0"
      >
        <DialogTitle className="hidden" />
        <DialogClose className="hidden" ref={ref}/>
        <SideBar onClose={handleClose} />
      </SheetContent>
    </Sheet>
  );
}
