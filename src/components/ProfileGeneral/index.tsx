import { request } from "@/api";
import LoadingButton from "@/components/LoadingButton.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { sendResetPasswordEmail } from "@/services/auth";
import {
  IUserLoginType,
  USER_LOGIN_TYPE,
  USER_PROFILE_ATOM,
} from "@/state/atoms/profile";
import { handleErrorMessage } from "@/utils/error";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useCallback, useState } from "react";

export default function ProfileGeneral() {
  const { toast } = useToast();
  const [profile] = useAtom(USER_PROFILE_ATOM);
  const [userLoginType] = useAtom(USER_LOGIN_TYPE);
  const getUserProfile = useUpdateProfile();
  const [name, setName] = useState<string>(
    (profile?.userName || profile?.name) ?? "",
  );

  const onNameSave = useCallback(async () => {
    try {
      await request.profile.editProfile({
        data: {
          userName: name,
          email: profile?.email,
          name: profile?.name,
          surname: profile?.surname,
          phoneNumber: profile?.phoneNumber,
          // concurrencyStamp: profile?.concurrencyStamp,
        },
      });
      toast({
        description: "successfully saved",
      });
      getUserProfile();
    } catch (error) {
      toast({
        description: handleErrorMessage(error, "Error: save name"),
      });
    }
  }, [toast, profile, name, getUserProfile]);

  const onResetPassword = useCallback(async () => {
    try {
      if (!profile?.email) throw `email: ${profile?.email}`;
      const result = await sendResetPasswordEmail(profile?.email);
      if (!((result?.code ?? "") as string).startsWith("2")) throw result;
      toast({ description: "Reset password email sent successfully!" });
    } catch (error) {
      toast({
        description: handleErrorMessage(error, "Error: reset password"),
      });
    }
  }, [profile, toast]);

  return (
    <div>
      <div className="flex justify-between items-center pb-[20px] lg:pb-[30px] border-b border-[var(--color-border-black-light)]">
        <div className="font-geist text-[18px] font-semibold">Profile</div>
      </div>
      <div className="pt-[30px]">
        <div>
          <div className="font-geist text-[13px] font-semibold leading-normal pb-[10px]">
            Name
          </div>
          <div className="flex gap-[10px]">
            <Input
              className="max-w-[498px] flex-1"
              placeholder={profile?.userName || profile?.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <LoadingButton
              variant="primary"
              className="font-semibold py-[7px] px-[17px] border-[var(--color-input)]"
              onClick={onNameSave}
            >
              Save
            </LoadingButton>
          </div>
        </div>
      </div>
      <div className="pt-[30px]">
        <div className="font-geist text-[13px] font-semibold leading-normal pb-[10px]">
          Email Address
        </div>
        <Input
          className="max-w-[498px] flex-1 disabled:opacity-100"
          disabled
          value={profile?.email}
        />
      </div>
      {userLoginType !== IUserLoginType.SOCIAL_MEDIA && (
        <div className="pt-[30px]">
          <div className="font-geist text-[16px] font-semibold leading-normal pb-[10px]">
            Reset Password
          </div>
          <div className="text-[var(--muted-foreground)] font-geist text-[14px] font-normal leading-normal">
            A password reset link will be sent to your email to reset your
            password.
            <br /> If you don't get an email within a few minutes, please
            re-try.
          </div>
          <Button
            className="mt-[18px] py-[8px] px-[18px] border-none bg-[var(--bg-primary)] text-[var(--primary-foreground)] text-[13px] leading-[14px]"
            onClick={onResetPassword}
          >
            Reset Password
          </Button>
        </div>
      )}
    </div>
  );
}
