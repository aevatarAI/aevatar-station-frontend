import Plus from "@/assets/+.svg?react";
import Loading from "@/assets/loading.svg?react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type TCreateApiKeyForm,
  createApiKeyForm,
} from "@/constants/form/createKeyApi";
import { useToast } from "@/hooks/use-toast";
import { useCreateAPIKey } from "@/hooks/useCreateAPIKey";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const projectList = ["02d2d4de-dfca-dc54-3e79-3a18c8cb355c"];

export default function CreateApiKeyDialog() {
  const form = useForm<TCreateApiKeyForm>({
    resolver: zodResolver(createApiKeyForm),
  });
  const [open, setOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState<boolean>();
  const { mutate } = useCreateAPIKey();
  const { toast } = useToast();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const onSubmit = useCallback(
    async (data: TCreateApiKeyForm) => {
      setBtnLoading(true);
      mutate(data);
      setBtnLoading(false);
      setOpen(false);
      toast({
        title: "",
        description: "successfully created",
      });
    },
    [toast],
  );

  useEffect(() => {
    open && form.reset();
  }, [form, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="py-[6px] gap-[10px] text-[12px] font-semibold leading-[14px]">
          <Plus />
          <span>create</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby="create new api key"
        className="w-[328px] p-5 flex flex-col gap-[28px] rounded-[6px] border border-[#303030]"
      >
        <DialogHeader>
          <DialogTitle className="text-left text-gradient inline text-[18px] font-semibold leading-normal lowercase">
            create new api key
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-[16px] items-start content-start self-stretch">
              <FormField
                key="name"
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem aria-labelledby="nameLabel" className="w-full">
                    <FormLabel id="nameLabel">name of the key</FormLabel>
                    <FormControl>
                      <Input placeholder="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                key="projectId"
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem aria-labelledby="project" className="w-full">
                    <FormLabel id="project">project</FormLabel>
                    <Select
                      value={field?.value}
                      disabled={field?.disabled}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger aria-disabled={field?.disabled}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-[286px] left-0 -top-[4px] p-[8px_8px_20px_10px] cutCorner cutCorner__white">
                        {projectList.map((item) => (
                          <SelectItem
                            className="text-[14px]"
                            key={item}
                            value={item}
                          >
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-start self-stretch pt-[12px]">
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
