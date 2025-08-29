import Layout from "@/app/Account/Layout";
import VerificationImage from "@/assets/verification.png";
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
import { useLogin } from "@/hooks/useLogin";
import { register, sendRegisterCode } from "@/services/auth";
import { emailAtom, passwordAtom, usernameAtom } from "@/state/atoms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  verificationCode: z.string(),
});

const Verification = () => {
  const [email] = useAtom(emailAtom);
  const [password] = useAtom(passwordAtom);
  const [name] = useAtom(usernameAtom);
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { loginUser } = useLogin();

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        const response = await register({
          userName: name,
          emailAddress: email,
          password,
          code: values.verificationCode,
        });

        if (!["20000", "20001"].includes(response.code)) {
          form.setError("verificationCode", {
            message:
              response.message ||
              "invalid verification code. please check and try again.",
          });
          return;
        }

        toast({ description: "verification successful." });

        const isLoggedIn = await loginUser(name, password);

        if (!isLoggedIn) {
          toast({ description: "log in failed." });
          return;
        }

        navigate("/welcome");
      } catch (error) {
        console.error(error, "register error");
        toast({
          description: "Network error. Please try again later.",
        });
      }
    },
    [toast, navigate, name, email, password, form, loginUser],
  );

  const sendVerificationCode = useCallback(async () => {
    try {
      const response = await sendRegisterCode(name, email);
      if (response.code !== "20001") {
        toast({
          description: response.message,
        });
      } else {
        toast({
          description: "Send Register Code successful!",
        });
      }
    } catch (_error) {
      toast({
        description: "Send Register Code failed. Please try again.",
      });
    }
  }, [toast, name, email]);
  return (
    <div className="flex flex-col text-[var(--color-foreground)]  w-full lg:w-[408px] gap-4">
      <div className="gap-3 flex-col flex">
        <h2 className="text-[18px] font-semibold">verification</h2>
        <p className="text-[var(--muted-foreground)] font-normal text-[13px] font-outfit">
          already registered?&nbsp;
          <span
            className="font-normal text-[var(--color-foreground)] cursor-pointer hover:text-[var(--muted-foreground)]"
            onClick={() => {
              navigate("/login");
            }}
          >
            login
          </span>
        </p>
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
                name="verificationCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[var(--color-foreground)] block text-[13px] font-semibold">
                      Verification Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="enter verification code"
                        {...field}
                        {...form.register("verificationCode", {
                          required: "required",
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
                type="submit"
                className="w-full flex justify-center border border-transparent bg-[var(--bg-primary)] text-[var(--primary-foreground)]"
              >
                register
              </Button>
              <div className="text-right">
                <span
                  className="text-[13px] cursor-pointer font-outfit text-[var(--color-foreground)] hover:text-[var(--muted-foreground)]"
                  onClick={sendVerificationCode}
                >
                  resend email
                </span>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

const VerificationPage = () => {
  return (
    <Layout backgroundImage={VerificationImage}>
      <Verification />
    </Layout>
  );
};

export default VerificationPage;
