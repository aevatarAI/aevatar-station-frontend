import Plus from "@/assets/+.svg?react";
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

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "@/assets/loading.svg?react";
import clsx from "clsx";
import { sleep } from "@etransfer/utils";
import { useToast } from "@/hooks/use-toast";
import {
  inviteMembersForm,
  type TInviteMembersKeyForm,
} from "@/constants/form/inviteMembers";

import { Checkbox } from "@/components/ui/checkbox";

const roleList = ["owner", "member"];

export default function InvitMembersDialog() {
  const form = useForm<TInviteMembersKeyForm>({
    resolver: zodResolver(inviteMembersForm),
    defaultValues: {
      role: "owner",
    },
  });
  const [open, setOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState<boolean>();

  const { toast } = useToast();

  const onSubmit = useCallback(
    async (values: TInviteMembersKeyForm) => {
      console.log(values, "values===");
      setBtnLoading(true);
      await sleep(2000);
      setBtnLoading(false);
      setOpen(false);
      toast({
        title: "",
        description: "successfully created",
        // duration: 30000000,
      });
    },
    [toast]
  );

  useEffect(() => {
    open && form.reset();
  }, [form, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="py-[6px] gap-[10px] text-[12px] font-semibold leading-[14px]">
          <Plus />
          <span>add new member</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby="create new api key"
        className="sm:max-w-[328px] p-5 flex flex-col gap-7 rounded-[6px] border border-[#303030]">
        <DialogHeader>
          <DialogTitle className="text-gradient inline text-[18px] font-semibold leading-normal lowercase">
            invite team members
          </DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-[28px] pt-[22px] items-start content-start self-stretch">
                <FormField
                  key={"email"}
                  control={form.control}
                  name={"email"}
                  render={({ field }) => (
                    <FormItem aria-labelledby="emailLabel" className="w-full">
                      <FormLabel id="emailLabel">email address</FormLabel>
                      <FormControl>
                        <Input placeholder="-" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem aria-labelledby="project" className="w-full">
                      <FormLabel id="project">role</FormLabel>
                      <Select
                        value={field?.value}
                        disabled={field?.disabled}
                        onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger aria-disabled={field?.disabled}>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="w-[193px] left-[48px] -top-[4px] py-[16px] px-[22px] cutCorner cutCorner__white">
                          {roleList.map((item) => (
                            <SelectItem
                              className="text-[14px]"
                              key={item}
                              value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defaultProject"
                  render={({ field }) => (
                    <FormItem className="flex gap-[8px] items-center -mt-[12px]">
                      <FormControl>
                        <Checkbox
                          className="border-[#989DA0] bg-white  disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#606060] data-[state=checked]:border-[#606060]"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal mb-0 !mt-0">
                        invite to default project
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <div className="flex justify-between items-start self-stretch pt-[8px]">
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
                    <span>{btnLoading ? "inviting" : "invite"}</span>
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
