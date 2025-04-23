import Delete from "@/assets/delete_action.svg?react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import TipIcon from "@/assets/tip_icon.svg?react";
import LoadingButton from "@/components/LoadingButton.tsx";
import { useToast } from "@/hooks/use-toast";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useCallback, useState } from "react";
interface IDeleteDialogProps {
  title: string;
  description?: string;
  disabled?: boolean;
  onYes?: () => Promise<void>;
}
export default function DeleteDialog({
  title,
  description,
  disabled,
  onYes,
}: IDeleteDialogProps) {
  const [open, setOpen] = useState(false);

  const onYesHandler = useCallback(async () => {
    await onYes?.();

    setOpen(false);
  }, [onYes]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {disabled ? (
        <Delete className="opacity-50" role="img" />
      ) : (
        <DialogTrigger asChild>
          <Delete className="cursor-pointer" role="img" />
        </DialogTrigger>
      )}
      <DialogContent
        aria-describedby="edit api key"
        className="w-[328px] p-5 flex flex-col rounded-[6px] border border-[#303030]"
      >
        <VisuallyHidden>
          <DialogTitle />
          <DialogDescription />
        </VisuallyHidden>
        <DialogHeader />
        <div className="text-center">
          <div className="flex flex-col items-center gap-[16px]">
            <TipIcon />
            <div className="text-white text-center font-syne text-[18px] font-semibold leading-normal lowercase w-[274px]">
              {title}
            </div>
            {description && (
              <div className="text-[#B9B9B9] font-source-code text-[12px] font-normal leading-normal lowercase w-[220px]">
                {description}
              </div>
            )}
          </div>

          <div className="flex justify-between items-start self-stretch pt-[28px] gap-[14px]">
            <Button
              className="text-[12px] flex-1 py-[7px] leading-[14px]"
              onClick={() => {
                setOpen(false);
              }}
            >
              cancel
            </Button>
            <LoadingButton
              className="text-[12px] bg-white text-[#303030] flex-1 py-[7px] leading-[14px]"
              onClick={onYesHandler}
            >
              yes
            </LoadingButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
