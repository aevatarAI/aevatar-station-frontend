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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { IMemberItem } from "@/api/utils/organization";
import Loading from "@/assets/loading.svg?react";
import {
  type TInviteMembersKeyForm,
  inviteMembersForm,
} from "@/constants/form/inviteMembers";
import { CURRENT_PROJECT_ROLE_ATOM } from "@/state/atoms/organisation";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface IInviteMembersDialogProps {
  defaultRoleId?: string;
  defaulteEmail?: string;
  orgMemberList: IMemberItem[];
  onAddMember: (values: TInviteMembersKeyForm) => Promise<void>;
}

export default function AddMembersDialog({
  defaultRoleId,
  defaulteEmail,
  orgMemberList,
  onAddMember,
}: IInviteMembersDialogProps) {
  const [roleList] = useAtom(CURRENT_PROJECT_ROLE_ATOM);

  const form = useForm<TInviteMembersKeyForm>({
    resolver: zodResolver(inviteMembersForm),
    defaultValues: {
      role: defaultRoleId ?? roleList[0]?.id,
      email: defaulteEmail ?? orgMemberList[0]?.email,
    },
  });
  const [open, setOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState<boolean>();

  const onSubmit = useCallback(
    async (values: TInviteMembersKeyForm) => {
      setBtnLoading(true);
      await onAddMember(values);
      setBtnLoading(false);
      setOpen(false);
    },
    [onAddMember],
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
        aria-describedby="add new member"
        className="w-[328px] p-5 flex flex-col gap-7 rounded-[6px] border border-[#303030]"
      >
        <DialogHeader>
          <DialogTitle className="text-left text-gradient inline text-[18px] font-semibold leading-normal lowercase">
            add team members
          </DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-[28px] pt-[22px] items-start content-start self-stretch">
                <FormField
                  control={form.control}
                  name={"email"}
                  render={({ field }) => (
                    <FormItem aria-labelledby="emailLabel" className="w-full">
                      <FormLabel id="emailLabel">email address</FormLabel>
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
                        <SelectContent className="w-[286px] left-0 -top-[4px] py-[16px] px-[22px] cutCorner cutCorner__white">
                          {orgMemberList.map((item) => (
                            <SelectItem
                              className="text-[14px]"
                              key={item.email}
                              value={item.email}
                            >
                              {item.email}
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
                  name="role"
                  render={({ field }) => (
                    <FormItem aria-labelledby="roleLobal" className="w-full">
                      <FormLabel id="roleLobal">role</FormLabel>
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
                        <SelectContent className="w-[286px] left-0 -top-[4px] py-[16px] px-[22px] cutCorner cutCorner__white">
                          {roleList.map((item) => (
                            <SelectItem
                              className="text-[14px]"
                              key={item.id}
                              value={item.id}
                            >
                              {item.name.split("_")[1]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      />
                    )}
                    <span>{btnLoading ? "adding" : "add"}</span>
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
