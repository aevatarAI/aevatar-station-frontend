import LogoIcon from "@/assets/logo.svg?react";
import { CustomButton } from "@/components/CustomButton";
import DescHome from "@/components/DescHome";
import socialMediaReander from "@/components/SocialMediaReander";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@/hooks/navigate";
import { useToast } from "@/hooks/use-toast";
import { resetPassword, verifyResetToken } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "password must be at least 8 characters long")
      .regex(
        /[^a-zA-Z0-9]/,
        "password must contain at least one non-alphanumeric character",
      )
      .regex(
        /[a-z]/,
        "password must contain at least one lowercase letter ('a'-'z')",
      )
      .regex(
        /[A-Z]/,
        "password must contain at least one uppercase letter ('A'-'Z')",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
  });
const ResetPassword = () => {
  const [userId, setUserId] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlUserId = params.get("userId") || "";
    const urlResetToken = params.get("resetToken") || "";
    setUserId(urlUserId);
    setResetToken(urlResetToken);
  }, []);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const navigate = useNavigate();
  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      setLoading(true);
      const verifyResult = await verifyResetToken(userId, resetToken);
      if (verifyResult.code !== "20000" || !verifyResult.data) {
        toast({
          description: verifyResult.message || "Invalid reset token.",
        });
        return;
      }
      const { password } = values;
      try {
        const result = await resetPassword(userId, resetToken, password);
        if (result.code === "20001") {
          toast({
            description: "password updated successfully",
          });
          navigate("/login");
        } else {
          toast({
            description: result.message || "Invalid reset token.",
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
    [toast, userId, resetToken, navigate],
  );
  return (
    <div className="flex flex-col text-white w-full lg:w-[426px] gap-4">
      <div className="gap-3 flex-col flex">
        <h2 className="text-[18px] font-semibold">reset password</h2>
      </div>
      <div className="h-[1px] bg-black-light w-full" />
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
                        type="password"
                        placeholder="enter your new password"
                        {...field}
                        {...form.register("password", {
                          required: "required",
                        })}
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
                      confirm new password*
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="re-enter your new password"
                        {...field}
                        {...form.register("confirmPassword", {
                          required: "required",
                        })}
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
                disabled={loading && !!userId && !!resetToken}
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
    <div className="flex flex-col pt-10 px-10">
      <CustomButton path="/">
        <LogoIcon />
      </CustomButton>
      <div className="relative flex px-[47px] max-h-[832px] h-screen flex-col items-center justify-between pt-[113px]">
        <div className="flex flex-col gap-[30px]">
          <DescHome className="items-start lg:items-center" />
          <div className="h-[1px] w-full bg-black-light" />
          <ResetPassword />
        </div>
        {socialMediaReander(
          "relative w-full lg:w-[408px] px-[47px] lg:px-0 lg:mb-[40px]",
        )}
      </div>
    </div>
  );
};
export default ResetPasswordPage;
