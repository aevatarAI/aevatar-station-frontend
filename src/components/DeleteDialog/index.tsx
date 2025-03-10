import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import Delete from "@/assets/delete_action.svg?react";

import { useCallback, useState } from "react";
import { sleep } from "@etransfer/utils";
import { useToast } from "@/hooks/use-toast";
import TipIcon from "@/assets/tip_icon.svg?react";
import LoadingButton from "@/components/LoadingButton.tsx";

interface IDeleteDialogProps {
  title: string;
  description: string;
  onYes?: () => Promise<void>;
}
export default function DeleteDialog({
  onYes,
  title,
  description,
}: IDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const onYesHandler = useCallback(async () => {
    await sleep(2000);
    await onYes?.();
    toast({
      description: "successfully delete",
    });
    setOpen(false);
  }, [toast, onYes]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Delete className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent
        aria-describedby="edit api key"
        className="sm:max-w-[328px] p-5 flex flex-col gap-7 rounded-[6px] border border-[#303030]">
        <DialogHeader />
        <div className="text-center">
          <div className="flex flex-col items-center gap-[16px]">
            <TipIcon />
            <div className="text-white text-center font-syne text-[18px] font-semibold leading-normal lowercase">
              {title}
            </div>
            <div className="text-[#B9B9B9] font-source-code text-[12px] font-normal leading-normal lowercase">
              {description}
            </div>
          </div>

          <div className="flex justify-between items-start self-stretch pt-[28px] gap-[14px]">
            <Button
              className="text-[12px] flex-1 py-[7px] leading-[14px]"
              onClick={() => {
                setOpen(false);
              }}>
              cancel
            </Button>
            <LoadingButton
              className="text-[12px] bg-white text-[#303030] flex-1 py-[7px] leading-[14px]"
              onClick={onYesHandler}>
              Yes
            </LoadingButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
