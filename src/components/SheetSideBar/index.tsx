"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Menu from "@/assets/menu.svg?react";
import { SideBar } from "@/components/SideBar";
import { DialogTitle } from "@/components/ui/dialog";

export function SheetSideBar() {
  return (
    <Sheet key={"left"}>
      <SheetTrigger asChild>
        <Menu className="lg:hidden cursor-pointer" />
      </SheetTrigger>
      <SheetContent
        side="left"
        closable={false}
        className="w-[200px] pt-[35px] p-0">
        <DialogTitle className="hidden" />
        <SideBar />
      </SheetContent>
    </Sheet>
  );
}
