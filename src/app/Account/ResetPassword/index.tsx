import DescHome from "@/components/DescHome";
import ForgotPasswordDialog from "@/components/ForgotPasswordDialog";
import socialMediaReander from "@/components/SocialMediaReander";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { resetPassword } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const formSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});
const ResetPassword = () => {
  const [userId, setUserId] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlUserId = params.get("userid") || "";
    const urlResetToken = params.get("resetToken") || "";

    if (!urlUserId || !urlResetToken) {
      toast({
        description: "Invalid reset link.",
      });
      return;
    }

    setUserId(urlUserId);
    setResetToken(urlResetToken);
  }, [toast]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      setLoading(true);
      const { password } = values;
      try {
        const result = await resetPassword(userId, resetToken, password);
        if (result.code === "20000" && result.data) {
          console.log("Reset successful!");
        } else {
          toast({
            description: "Invalid reset token.",
          });
        }
      } catch {
        toast({
          description: "Reset failed. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast, userId, resetToken],
  );
  return (
    <div className="flex flex-col text-white w-full lg:w-[426px] gap-4">
      <div className="gap-3 flex-col flex">
        <h2 className="text-[18px] font-semibold">reset password</h2>
      </div>
      <div className="border border-black-light w-full" />
      <div className="text-gray-light">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="gap-5 flex flex-col"
          >
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-[12px] font-semibold">
                      password*
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="password"
                        {...field}
                        className="h-[35px] placeholder:text-gray-deep border-black-light"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-[12px] font-semibold">
                      confirm (repear) the password*
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="password"
                        {...field}
                        className="h-[35px] placeholder:text-gray-deep border-black-light"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-[10px]">
              <Button
                type="submit"
                className="w-full flex justify-center border border-transparent bg-white text-black-light"
                disabled={loading}
              >
                submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
const ResetPasswordPage = () => {
  return (
    <div className="relative flex justify-center px-[47px] h-screen ">
      <div className="mt-[178px] flex  flex-col gap-[30px]">
        <DescHome className="items-start lg:items-center" />
        <div className="h-[1px] w-full bg-black-light" />
        <ResetPassword />
      </div>
      {socialMediaReander(
        "fixed lg:absolute w-full lg:w-[408px] bottom-[40px] px-[47px] lg:px-0 left-0 lg:left-auto",
      )}
    </div>
  );
};
export default ResetPasswordPage;
