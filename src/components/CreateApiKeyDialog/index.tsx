import Plus from "@/assets/+.svg?react";
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
import { useGetProjects } from "@/hooks/useGetProjects";
import { CURRENT_PROJECT_ATOM } from "@/state/atoms/organisation";
import { useAtom } from "jotai";
interface APIKey {
  id: string;
  displayName: string;
  domainName: string;
  creationTime: number;
  memberCount: number;
}
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function CreateApiKeyDialog({
  disabled,
}: {
  disabled: boolean;
}) {
  const { data: projectList, isLoading } = useGetProjects();
  const [currentProject] = useAtom(CURRENT_PROJECT_ATOM);
  const { mutate } = useCreateAPIKey();
  const form = useForm<TCreateApiKeyForm>({
    resolver: zodResolver(createApiKeyForm),
    values: {
      name: "",
      projectId: currentProject || "",
    },
  });
  const [open, setOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState<boolean>();
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
        description: "Successfully created",
      });
    },
    [toast],
  );

  useEffect(() => {
    open && form.reset();
  }, [form, open]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="primary"
          className="py-[6px] gap-[10px] text-[13px] font-semibold leading-[14px]"
          disabled={disabled}
        >
          <Plus />
          <span>Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby="Create new API key"
        className="w-[328px] p-5 flex flex-col gap-[28px] rounded-[6px] border border-[var(--color-border-black-light)]"
      >
        <DialogHeader>
          <DialogTitle className="text-left  inline text-[18px] font-semibold leading-normal">
            Create new API key
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
                    <FormLabel id="nameLabel">Name of the key</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
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
                    <FormLabel id="project">Project</FormLabel>
                    <Select
                      value={field?.value}
                      disabled={field?.disabled}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger
                          aria-disabled={field?.disabled}
                          className="normal-case"
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-[286px] left-0 -top-[4px] p-[8px_8px_20px_10px] cutCorner cutCorner__white">
                        {projectList?.data?.items?.map((item: APIKey) => (
                          <SelectItem
                            className="text-[16px] normal-case"
                            key={item.id}
                            value={item.id}
                          >
                            {item.displayName}
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
