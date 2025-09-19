import Edit from "@/assets/edit_action.svg?react";
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
import { itemHoverNotBorderClassName } from "@/constants/cls";
import { itemClassName } from "@/constants/cls";
import {
  type TEditApiKeyForm,
  editKeyApiForm,
} from "@/constants/form/editKeyApi";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
interface EditApiKeyDialogProps {
  name: string;
  disabled?: boolean;
  onYes: (name: string) => Promise<void>;
}

export default function EditApiKeyDialog({
  name,
  disabled,
  onYes,
}: EditApiKeyDialogProps) {
  const form = useForm<TEditApiKeyForm>({
    resolver: zodResolver(editKeyApiForm),
  });
  const [btnLoading, setBtnLoading] = useState<boolean>();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const onSubmit = useCallback(
    async (values: TEditApiKeyForm) => {
      setBtnLoading(true);
      onYes(values.name);
      setBtnLoading(false);
      setOpen(false);
      toast({
        title: "",
        description: "Successfully saved",
      });
    },
    [toast, onYes],
  );

  useEffect(() => {
    open && form.reset();
  }, [form, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {disabled ? (
        <Edit className="opacity-50" />
      ) : (
        <DialogTrigger asChild>
          <div
            className={clsx(
              itemClassName,
              itemHoverNotBorderClassName,
              "justify-start py-1.5 px-2 rounded-[4px]",
            )}
          >
            Edit
          </div>
        </DialogTrigger>
      )}
      <DialogContent
        aria-describedby="edit api key"
        className="w-[328px] p-5 flex flex-col gap-[28px] rounded-[6px] border border-[var(--color-border-black-light)]"
      >
        <DialogHeader>
          <DialogTitle className="text-left  inline text-[18px] font-semibold leading-normal">
            Edit API Key
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-[28px] items-start content-start self-stretch">
              <FormField
                key={"name"}
                control={form.control}
                name={"name"}
                render={({ field }) => (
                  <FormItem aria-labelledby="nameLabel" className="w-full">
                    <FormLabel id="nameLabel">Name of the Key</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name"
                        {...field}
                        defaultValue={name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between items-start self-stretch pt-[8px]">
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
                  className="text-[13px] py-[7px] leading-[14px]"
                  type="submit"
                >
                  {btnLoading && (
                    <Loading
                      key={"save"}
                      className={clsx("aevatarai-loading-icon")}
                      style={{ width: 14, height: 14 }}
                    />
                  )}
                  <span>{btnLoading ? "Saving" : "Save"}</span>
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
