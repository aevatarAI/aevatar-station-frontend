import { request } from "@/api";
import LoadingButton from "@/components/LoadingButton.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { sendResetPasswordEmail } from "@/services/auth";
import { USER_PROFILE_ATOM } from "@/state/atoms/profile";
import { handleErrorMessage } from "@/utils/error";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

export default function ProfileGeneral() {
  const { toast } = useToast();
  const [profile] = useAtom(USER_PROFILE_ATOM);
  const getUserProfile = useUpdateProfile();
  const [name, setName] = useState<string>(profile?.userName ?? "");
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
      <div className="flex justify-between items-center pb-[20px] lg:pb-[30px] border-b border-[#303030]">
        <div className="font-syne text-[18px] font-semibold lowercase aevatarai-text-gradient">
          profile
        </div>
      </div>
      <div className="pt-[30px]">
        <div>
          <div className="text-[#B9B9B9] font-syne text-[12px] font-semibold leading-normal pb-[10px]">
            name
          </div>
          <div className="flex gap-[10px]">
            <Input
              className="max-w-[498px] flex-1"
              placeholder={profile?.userName}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <LoadingButton
              className="font-semibold py-[7px] px-[17px] border-input"
              onClick={onNameSave}
            >
              save
            </LoadingButton>
          </div>
        </div>
      </div>
      <div className="pt-[30px]">
        <div className="text-[#B9B9B9] font-syne text-[12px] font-semibold leading-normal pb-[10px]">
          email address
        </div>
        <Input className="max-w-[498px] flex-1" value={profile?.email} />
      </div>
      <div className="pt-[30px]">
        <div className="text-[#B9B9B9] font-syne text-[14px] font-semibold leading-normal pb-[10px]">
          reset password
        </div>
        <div className="text-[#B9B9B9] font-pro text-[13px] font-normal leading-normal lowercase">
          A password reset link will be sent to your email to reset your
          password.
          <br /> if you don't get an email within a few minutes. please re-try.
        </div>
        <Button
          className="mt-[18px] py-[8px] px-[18px] border-none bg-white text-[#303030] text-[12px] leading-[14px]"
          onClick={onResetPassword}
        >
          reset password
        </Button>
      </div>
    </div>
  );
}
