import Add from "@/assets/add.svg?react";
import Dll from "@/assets/dll_menu.svg?react";
import Loading from "@/assets/loading.svg?react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  CreateCrossURLSchema,
  type TCreateCrossURLForm,
} from "@/constants/form/CreateCrossURL";
import { useToast } from "@/hooks/use-toast";
import { handleErrorMessage } from "@/utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

interface ICreateCrossURLDialogProps {
  type: "edit" | "create";
  disabled?: boolean;
  fullWidth?: boolean;
  onSubmit?: (values: TCreateCrossURLForm) => Promise<void>;
}

export default function CreateCrossURLDialog({
  type,
  disabled,
  fullWidth,
  onSubmit: onFinish,
}: ICreateCrossURLDialogProps) {
  const form = useForm<TCreateCrossURLForm>({
    resolver: zodResolver(CreateCrossURLSchema),
    defaultValues: {
      domain: "",
    },
  });
  const [open, setOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState<boolean>();
  const { toast } = useToast();

  const onSubmit = useCallback(
    async (values: TCreateCrossURLForm) => {
      try {
        setBtnLoading(true);
        await onFinish?.(values);
        setBtnLoading(false);
        setOpen(false);
        toast({
          title: "",
          description: "cross-origin domain added",
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
    if (btnLoading) return "Adding";
    return "Add";
  }, [btnLoading]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "create" ? (
          <Button
            variant="primary"
            disabled={disabled}
            className={clsx(
              "text-center font-geist text-[13px] font-semibold py-[7px] leading-[14px] group",
              fullWidth && "w-full",
              disabled && "disabled:hover:bg-transparent",
              disabled
                ? "group-hover:text-[var(--color-foreground)]"
                : "group-hover:text-[var(--primary-foreground)]",
            )}
          >
            <Add
              className={clsx(
                "w-[14px]! h-[14px]!",
                disabled && "text-[var(--muted-foreground)]",
                disabled
                  ? "group-hover:text-[var(--color-foreground)]"
                  : "group-hover:text-[var(--primary-foreground)]",
              )}
            />
            <span
              className={clsx(disabled && "text-[var(--color-foreground)]!")}
            >
              Add
            </span>
          </Button>
        ) : (
          <Dll
            className={clsx(
              "cursor-pointer w-[14px] h-[14px] text-[var(--muted-foreground)]",
            )}
          />
        )}
      </DialogTrigger>
      <DialogContent
        aria-describedby="create new api key"
        className="w-[328px] sm:w-[328px] p-5 flex flex-col gap-[28px] rounded-[6px] border border-[var(--color-border-black-light)]"
      >
        <DialogHeader>
          <DialogTitle className="text-left inline text-[18px] pb-[18px] font-semibold leading-normal">
            {type === "create"
              ? "Add cross-origin domain"
              : "Update cross-origin domain"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-[28px] items-start content-start self-stretch">
              <FormField
                key="domain"
                control={form.control}
                name={"domain"}
                render={({ field }) => (
                  <FormItem aria-labelledby="domain" className="w-full">
                    <FormLabel id="domain">Domain</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="-"
                        {...field}
                        className="h-[35px] placeholder:text-[var(--muted-foreground)] border-[var(--color-border-black-light)]"
                      />
                    </FormControl>
                    <FormMessage />
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
                    "text-[13px] py-[7px] leading-[14px] w-[79px]",
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
