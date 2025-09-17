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
  SelectContentHypotenuse,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Loading from "@/assets/loading.svg?react";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  type TInviteMembersKeyForm,
  inviteMembersForm,
} from "@/constants/form/inviteMembers";
import { CURRENT_ORGANIZATION_ROLE_ATOM } from "@/state/atoms/organisation";
import { useAtom } from "jotai";

export default function InviteMembersDialog({
  defaultRole,
  onAddMember,
}: {
  defaultRole?: string;
  onAddMember: (values: TInviteMembersKeyForm) => Promise<void>;
}) {
  const [roleList] = useAtom(CURRENT_ORGANIZATION_ROLE_ATOM);

  const form = useForm<TInviteMembersKeyForm>({
    resolver: zodResolver(inviteMembersForm),
    defaultValues: {
      role: defaultRole,
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
    if (open) {
      form.reset({
        email: "",
        role: defaultRole,
      });
    }
  }, [form, open, defaultRole]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="primary"
          className="py-[6px] gap-[10px] text-[13px] font-semibold leading-[14px]"
        >
          <Plus />
          <span>Add New Member</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby="create new api key"
        className="w-[328px] p-5 flex flex-col gap-[28px] rounded-[6px] border border-[var(--color-border-black-light)]"
      >
        <DialogHeader>
          <DialogTitle className="text-left  inline text-[18px] font-semibold leading-normal">
            Invite Team Members
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-[28px] items-start content-start self-stretch">
              <FormField
                key={"email"}
                control={form.control}
                name={"email"}
                render={({ field }) => (
                  <FormItem aria-labelledby="emailLabel" className="w-full">
                    <FormLabel id="emailLabel">Email Address</FormLabel>
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
                    <FormLabel id="project">Role</FormLabel>
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
                      <SelectContentHypotenuse wrapperClassName="w-[286px] left-0 -top-[4px]">
                        {roleList.map((item) => (
                          <SelectItem
                            key={item.id}
                            value={item.id}
                            className="text-[var(--muted-foreground)] text-center font-geist py-[7px] select-item-wrapper text-[16px]"
                          >
                            {item.name.split("_")[1]}
                          </SelectItem>
                        ))}
                      </SelectContentHypotenuse>
                    </Select>
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
                  className="text-[13px] bg-[var(--bg-primary)] text-[var(--primary-foreground)] py-[7px] leading-[14px]"
                  type="submit"
                  variant="primary"
                >
                  {btnLoading && (
                    <Loading
                      className={clsx("aevatarai-loading-icon")}
                      style={{ width: 14, height: 14 }}
                    />
                  )}
                  <span>{btnLoading ? "Inviting" : "Invite"}</span>
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
