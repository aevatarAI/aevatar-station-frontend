import Dll from "@/assets/dll_menu.svg?react";
import Loading from "@/assets/loading.svg?react";
import DropzoneItem from "@/components/DropzoneItem";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { DllSchema, type TDllEditForm } from "@/constants/form/dll";
import { useToast } from "@/hooks/use-toast";
import { handleErrorMessage } from "@/utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

interface IDllEditDialogProps {
  type: "edit" | "create";
  disabled?: boolean;
  fullWidth?: boolean;
  onSubmit?: (values: TDllEditForm) => Promise<void>;
}

export default function DllEditDialog({
  type,
  disabled,
  fullWidth,
  onSubmit: onFinish,
}: IDllEditDialogProps) {
  const form = useForm<TDllEditForm>({
    resolver: zodResolver(DllSchema),
    defaultValues: {
      file: [],
    },
  });
  const [open, setOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState<boolean>();
  const { toast } = useToast();

  const onSubmit = useCallback(
    async (values: TDllEditForm) => {
      try {
        setBtnLoading(true);
        await onFinish?.(values);
        setBtnLoading(false);
        setOpen(false);
        toast({
          title: "",
          description: "dll uploaded",
        });
      } catch (error) {
        toast({
          title: "error",
          description: handleErrorMessage(error, "something error"),
        });
        setBtnLoading(false);
      }
    },
    [toast, onFinish],
  );

  useEffect(() => {
    open && form.reset();
  }, [form, open]);

  const btnText = useMemo(() => {
    if (btnLoading) return "Uploading";
    return "Upload";
  }, [btnLoading]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "create" ? (
          <Button
            disabled={disabled}
            variant="primary"
            className={clsx(
              " text-center font-outfit text-[13px] font-semibold py-[7px] leading-[14px] disabled:opacity/100 disabled:pointer-events-auto group",
              fullWidth && "w-full",
              disabled && "disabled:hover:bg-transparent",
              disabled
                ? "group-hover:text-[var(--color-foreground)]"
                : "group-hover:text-[var(--primary-foreground)]",
            )}
          >
            <Dll
              className={clsx(
                "w-[16px] h-[16px]",
                disabled && "text-[var(--muted-foreground)]",
                disabled
                  ? "group-hover:text-[var(--color-foreground)]"
                  : "group-hover:text-[var(--primary-foreground)]",
              )}
            />
            <span
              className={clsx(disabled && "text-[var(--color-foreground)]!")}
            >
              Upload
            </span>
          </Button>
        ) : (
          <Dll
            className={clsx(
              "cursor-pointer w-[16px] h-[16px] text-[var(--muted-foreground)]",
            )}
          />
        )}
      </DialogTrigger>
      <DialogContent
        aria-describedby="create new api key"
        className="w-[329px] sm:w-[635px] p-5 flex flex-col gap-[28px] rounded-[6px] border border-[var(--color-border-black-light)]"
      >
        <DialogHeader>
          <DialogTitle className="text-left inline text-[18px] pb-[18px] border-b border-[var(--color-border-black-light)] font-semibold leading-normal">
            {type === "create" ? "Upload DLL File" : "Update DLL File"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-[28px] items-start content-start self-stretch">
              <FormField
                control={form.control}
                name={"file"}
                render={() => (
                  <FormItem className="w-full">
                    <FormControl>
                      <DropzoneItem
                        hiddenLabel={true}
                        form={form as any}
                        name={"file"}
                        multiple={false}
                        uploadText="Click to select file (DLL)"
                        accept={{ "application/octet-stream": [".dll"] }}
                        aria-label="DLL file input"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-start w-full">
                <Button
                  variant="outline"
                  className="text-[13px] py-[7px] leading-[14px]"
                  type="reset"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className={clsx(
                    "text-[13px] bg-[var(--bg-primary)] text-[var(--primary-foreground)] py-[7px] leading-[14px] w-[79px]",
                  )}
                  type="submit"
                >
                  {btnLoading && (
                    <Loading
                      className={clsx("aevatarai-loading-icon")}
                      style={{ width: 14, height: 14 }}
                    />
                  )}
                  {!btnLoading && <span>{btnText}</span>}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
