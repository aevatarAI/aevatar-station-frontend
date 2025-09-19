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
      .min(6, "Password must be at least 6 characters long")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one non-alphanumeric character",
      )
      .regex(
        /[a-z]/,
        "Password must contain at least one lowercase letter ('a'-'z')",
      )
      .regex(
        /[A-Z]/,
        "Password must contain at least one uppercase letter ('A'-'Z')",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
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
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
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
            description: "Password updated successfully",
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
    <div className="flex flex-col text-[var(--color-foreground)] w-full lg:w-[426px] gap-4">
      <div className="gap-3 flex-col flex">
        <h2 className="text-[18px] font-semibold">Reset password</h2>
      </div>
      <div className="h-px bg-[var(--bg-black-light)] w-full" />
      <div className="text-[var(--muted-foreground)]">
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
                    <FormLabel className="block text-[13px] font-semibold">
                      New password*
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your new password"
                        {...field}
                        {...form.register("password", {
                          required: "Required",
                        })}
                        className="h-[35px] placeholder:text-[var(--muted-foreground)] border-[var(--color-border-black-light)]"
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
                    <FormLabel className="block text-[13px] font-semibold">
                      Confirm new password*
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Re-enter your new password"
                        {...field}
                        {...form.register("confirmPassword", {
                          required: "Required",
                        })}
                        className="h-[35px] placeholder:text-[var(--muted-foreground)] border-[var(--color-border-black-light)]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-[10px]">
              <Button
                variant="primary"
                type="submit"
                className="w-full flex justify-center border border-transparent"
                disabled={loading && !!userId && !!resetToken}
              >
                Submit
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
    <div className="flex flex-col h-screen pt-10 px-10">
      <CustomButton path="/">
        <LogoIcon />
      </CustomButton>
      <div className="flex flex-1 flex-col items-center justify-between px-[47px] py-[40px]">
        <div className="flex flex-col gap-[50px] lg:w-[426px] mt-[73px]">
          <DescHome className="items-start lg:items-center" />
          <div className="h-px w-full bg-[var(--bg-black-light)]" />
          <ResetPassword />
        </div>
        <div className="w-full lg:w-[408px]">
          {socialMediaReander("relative w-full")}
        </div>
      </div>
    </div>
  );
};
export default ResetPasswordPage;
