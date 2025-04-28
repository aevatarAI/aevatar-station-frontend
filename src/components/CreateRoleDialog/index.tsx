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

import {
  type TCreateRoleForm,
  createRoleForm,
} from "@/constants/form/createRole";

export interface ICreateRoleDialogProps {
  onCreate?: (values: TCreateRoleForm) => Promise<void>;
}

export default function CreateRoleDialog({ onCreate }: ICreateRoleDialogProps) {
  const form = useForm<TCreateRoleForm>({
    resolver: zodResolver(createRoleForm),
  });
  const [open, setOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState<boolean>();

  const { toast } = useToast();

  const onSubmit = useCallback(
    async (values: TCreateRoleForm) => {
      setBtnLoading(true);
      await onCreate?.(values);
      setBtnLoading(false);
      setOpen(false);
      toast({
        title: "",
        description: "successfully created",
      });
    },
    [toast, onCreate],
  );

  useEffect(() => {
    open && form.reset();
  }, [form, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="py-[6px] gap-[10px] text-[12px] font-semibold leading-[14px]">
          <Plus />
          <span>add role</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby="create new api key"
        className="w-[328px] p-5 flex flex-col gap-[28px] rounded-[6px] border border-[#303030]"
      >
        <DialogHeader>
          <DialogTitle className="text-left aevatarai-text-gradient-center inline text-[18px] font-semibold leading-normal lowercase bg-linear-to-r from-white to-gray-600">
            create role
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-[28px] items-start content-start self-stretch">
              <FormField
                key={"roleName"}
                control={form.control}
                name={"roleName"}
                render={({ field }) => (
                  <FormItem aria-labelledby="emailLabel" className="w-full">
                    <FormLabel id="emailLabel">role name</FormLabel>
                    <FormControl>
                      <Input placeholder="-" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between items-start self-stretch pt-[8px]">
                <Button
                  className="text-[12px] py-[7px] leading-[14px]"
                  type="reset"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  cancel
                </Button>
                <Button
                  className="text-[12px] bg-white text-[#303030] py-[7px] leading-[14px]"
                  type="submit"
                >
                  {btnLoading && (
                    <Loading
                      className={clsx("aevatarai-loading-icon")}
                      style={{ width: 14, height: 14 }}
                      data-testid="loading-icon"
                    />
                  )}
                  <span>{btnLoading ? "creating" : "create"}</span>
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
