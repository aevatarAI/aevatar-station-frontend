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
import Edit from "@/assets/edit_action.svg?react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "@/assets/loading.svg?react";
import clsx from "clsx";
import { handleErrorMessage } from "@etransfer/utils";
import { useToast } from "@/hooks/use-toast";
import {
  ProjectEditForm,
  type TProjectEditForm,
} from "@/constants/form/project";

interface IProjectEditDialogProps {
  type: "edit" | "create";
  name?: string;
  domainName?: string;
  onSubmit?: (values: TProjectEditForm) => Promise<void>;
}

export default function ProjectEditDialog({
  type,
  name,
  domainName,
  onSubmit: onFinish,
}: IProjectEditDialogProps) {
  const form = useForm<TProjectEditForm>({
    resolver: zodResolver(ProjectEditForm),
    defaultValues: {
      name,
      domainName,
    },
  });
  const [open, setOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState<boolean>();

  const { toast } = useToast();

  const onSubmit = useCallback(
    async (values: TProjectEditForm) => {
      console.log(values, "values===");
      try {
        setBtnLoading(true);
        await onFinish?.(values);
        setBtnLoading(false);
        setOpen(false);
        toast({
          title: "",
          description: `successfully ${
            type === "create" ? "created" : "saved"
          }`,
          // duration: 30000000,
        });
      } catch (error) {
        toast({
          title: "error",
          description: handleErrorMessage(error, "something error"),
          // duration: 30000000,
        });
        setBtnLoading(false);
      }
    },
    [toast, onFinish, type]
  );

  useEffect(() => {
    open && form.reset();
  }, [form, open]);

  const btnText = useMemo(() => {
    if (type === "create") {
      if (btnLoading) return "creating";
      return "create";
    }
    if (btnLoading) return "saving";
    return "save";
  }, [btnLoading, type]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "create" ? (
          <Button className="py-[6px] gap-[10px] text-[12px] font-semibold leading-[14px]">
            <Plus />
            <span>create</span>
          </Button>
        ) : (
          <Edit className="cursor-pointer" />
        )}
      </DialogTrigger>
      <DialogContent
        aria-describedby="create new api key"
        className="w-[328px] p-5 flex flex-col gap-[28px] rounded-[6px] border border-[#303030]">
        <DialogHeader>
          <DialogTitle className="text-left text-gradient inline text-[18px] font-semibold leading-normal lowercase">
            {type === "create" ? "create project" : "edit project"}
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
                    <FormLabel id="nameLabel">project name</FormLabel>
                    <FormControl>
                      <Input placeholder="-" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="domainName"
                render={({ field }) => (
                  <FormItem
                    aria-labelledby="domainNameLabel"
                    className="w-full">
                    <FormLabel id="domainNameLabel">domain name</FormLabel>
                    <FormControl>
                      <Input placeholder="-" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-start self-stretch">
                <Button
                  className="text-[12px] py-[7px] leading-[14px]"
                  type="reset"
                  onClick={() => {
                    setOpen(false);
                  }}>
                  cancel
                </Button>
                <Button
                  className="text-[12px] bg-white text-[#303030] py-[7px] leading-[14px]"
                  type="submit">
                  {btnLoading && (
                    <Loading
                      className={clsx("aevatarai-loading-icon")}
                      style={{ width: 14, height: 14 }}
                    />
                  )}
                  <span>{btnText}</span>
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
