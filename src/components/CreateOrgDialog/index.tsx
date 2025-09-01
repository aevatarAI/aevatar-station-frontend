import Plus from "@/assets/+.svg?react";
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

import Loading from "@/assets/loading.svg?react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { type TCreateOrgForm, createOrgForm } from "@/constants/form/createOrg";
import { handleErrorMessage } from "@/utils/error";

export interface ICreateOrgDialogProps {
  onCreate?: (values: TCreateOrgForm) => Promise<void>;
}

export default function CreateOrgDialog({ onCreate }: ICreateOrgDialogProps) {
  const form = useForm<TCreateOrgForm>({
    resolver: zodResolver(createOrgForm),
  });
  const [open, setOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState<boolean>();

  const { toast } = useToast();

  const onSubmit = useCallback(
    async (values: TCreateOrgForm) => {
      try {
        setBtnLoading(true);
        await onCreate?.(values);
        setBtnLoading(false);
        setOpen(false);
        toast({
          title: "",
          description: "Successfully created",
        });
      } catch (error) {
        setBtnLoading(false);
        toast({
          title: "",
          description: handleErrorMessage(
            error,
            "Failed to create organization",
          ),
        });
      }
    },
    [toast, onCreate],
  );

  useEffect(() => {
    open && form.reset();
  }, [form, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="py-[8px] bg-[var(--bg-background)] gap-[7px] text-[16px] font-semibold leading-[20px]  w-full border-[var(--color-border-black-light)]">
          <Plus />
          <span>Create Organisation</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby="create new api key"
        className="w-[328px] p-5 flex flex-col gap-[28px] rounded-[6px] border border-[var(--color-border-black-light)]"
      >
        <DialogHeader>
          <DialogTitle className="text-left inline text-[18px] font-semibold leading-normal">
            Create New Organisation
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-[28px] items-start content-start self-stretch">
              <FormField
                key={"orgName"}
                control={form.control}
                name={"orgName"}
                render={({ field }) => (
                  <FormItem aria-labelledby="emailLabel" className="w-full">
                    <FormLabel id="orgLabel">Name of Organisation</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
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
                      className={clsx("aevatarai-loading-icon")}
                      style={{ width: 14, height: 14 }}
                      data-testid="loading-icon"
                    />
                  )}
                  <span>{btnLoading ? "Creating" : "Create"}</span>
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
