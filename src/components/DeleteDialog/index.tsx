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
import { itemClassName, itemHoverNotBorderClassName } from "@/constants/cls";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import clsx from "clsx";
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
        <div
          className={clsx(
            itemClassName,
            itemHoverNotBorderClassName,
            "opacity-50",
          )}
        >
          Delete
        </div>
      ) : (
        <DialogTrigger asChild>
          <div
            className={clsx(
              itemClassName,
              itemHoverNotBorderClassName,
              "text-[var(--text-destructive)]",
              "justify-start py-1.5 px-2 rounded-[4px]",
            )}
          >
            Delete
          </div>
        </DialogTrigger>
      )}
      <DialogContent
        aria-describedby="edit api key"
        className="w-[328px] p-5 flex flex-col rounded-[6px] border border-[var(--color-border-black-light)]"
      >
        <VisuallyHidden>
          <DialogTitle />
          <DialogDescription />
        </VisuallyHidden>
        <DialogHeader />
        <div className="text-center">
          <div className="flex flex-col items-center gap-[16px]">
            <TipIcon />
            <div className="text-[var(--color-foreground)] text-center font-geist text-[18px] font-semibold w-[274px]">
              {title}
            </div>
            {description && (
              <div className="text-[var(--muted-foreground)] font-geist text-[13px] font-normal leading-normal w-[220px]">
                {description}
              </div>
            )}
          </div>

          <div className="flex justify-between items-start self-stretch pt-[28px] gap-[14px]">
            <Button
              variant="outline"
              className="text-[13px] flex-1 py-[7px] leading-[14px]"
              onClick={() => {
                setOpen(false);
              }}
            >
              cancel
            </Button>
            <LoadingButton
              variant="primary"
              className="text-[13px] flex-1 py-[7px] leading-[14px]"
              onClick={onYesHandler}
              aria-label="yes"
              data-testid="delete-dll-btn"
            >
              yes
            </LoadingButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
