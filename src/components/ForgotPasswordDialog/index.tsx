import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { useToast } from "@/hooks/use-toast";
import { sendResetPasswordEmail } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({
    message: "please enter a valid email address.",
  }),
});
const ForgotPasswordDialog = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      setLoading(true);
      try {
        const result = await sendResetPasswordEmail(values.email);
        if (result.code === "20001") {
          toast({ description: "Reset password email sent successfully!" });
          setIsSubmitted(true);
        } else {
          toast({
            description:
              result.message || "Failed to send reset password email.",
          });
        }
      } catch {
        toast({ description: "An error occurred. Please try again." });
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-[13px] cursor-pointer font-outfit text-[var(--color-foreground)] ">
          forgot password?
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-[328px] p-5 flex flex-col gap-7">
        <DialogHeader>
          <DialogTitle className="text-[var(--color-foreground)] inline mt-[4px]">
            forgot password?
          </DialogTitle>
        </DialogHeader>
        {isSubmitted ? (
          <div>
            <DialogDescription className="mb-7 font-outfit">
              an account recovery email has been sent. if you don’t see it in 15
              minutes, check your junk folder and mark it as ‘not junk’.
            </DialogDescription>
            <div className="flex justify-between items-center">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="text-[var(--color-foreground)] text-[13px] px-[16px] py-[8px]"
                >
                  back to login
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="primary"
                className={`bg-[var(--bg-primary)] text-[var(--primary-foreground)] text-[13px] px-[16px] py-[8px] ${
                  loading ? "opacity-50" : "opacity-100"
                }`}
                onClick={form.handleSubmit(onSubmit)}
              >
                resend password
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <DialogDescription>
              a password reset link will be sent to your email to reset your
              password. if you don't get an email within a few minutes, please
              re-try.
            </DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-7 mt-4"
              >
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-[13px] font-semibold">
                          email address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="enter your email"
                            className="placeholder:text-[var(--muted-foreground)] border-[var(--color-border-black-light)] text-[var(--color-foreground)]"
                            {...field}
                            {...form.register("email", {
                              required: "required",
                            })}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      type="button"
                      className="text-[13px] px-[16px] py-[8px]"
                    >
                      back to login
                    </Button>
                  </DialogClose>
                  <Button
                    formNoValidate
                    variant="primary"
                    type="submit"
                    className="bg-[var(--bg-primary)] text-[13px] text-[var(--primary-foreground)] px-[16px] py-[8px]"
                    disabled={loading}
                  >
                    submit
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
