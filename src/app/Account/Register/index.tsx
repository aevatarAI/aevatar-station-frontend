import Layout from "@/app/Account/Layout";
import RegisterImage from "@/assets/register.png";
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
import { sendRegisterCode } from "@/services/auth";
import { emailAtom, passwordAtom, usernameAtom } from "@/state/atoms";
import { delay } from "@/utils/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name must be at least 1 character long")
    .regex(
      /^[a-zA-Z0-9\-._@+]+$/,
      "Username is invalid, can only contain letters or digits.",
    ),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
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
    )
    .regex(/[0-9]/, "Password must contain at least one digit ('0'-'9')"),
});

const Register = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  // atom, for verification page
  const setName = useSetAtom(usernameAtom);
  const setEmail = useSetAtom(emailAtom);
  const setPassword = useSetAtom(passwordAtom);
  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      setLoading(true);
      const { name, email, password } = values;
      try {
        const result = await sendRegisterCode(name, email);
        setName(name);
        setEmail(email);
        setPassword(password);
        if (result.code === "20001") {
          toast({
            description: "Send Register Code successful!",
          });
          await delay(2000);
          setLoading(false);
          navigate("/verification");
        } else {
          toast({
            description:
              result.message || "Send Register Code failed. Please try again.",
          });
          setLoading(false);
        }
      } catch (_error) {
        toast({
          description: "Send Register Code failed. Please try again.",
        });
        setLoading(false);
      }
    },
    [toast, navigate, setName, setEmail, setPassword],
  );

  return (
    <div className="flex flex-col text-[var(--color-foreground)] w-full lg:w-[408px] gap-4">
      <div className="gap-3 flex-col flex">
        <h2 className="text-[18px] font-semibold">Register</h2>
        <p className="text-[var(--muted-foreground)] font-normal text-[13px] font-geist">
          already registered?&nbsp;
          <span
            className="font-normal text-[var(--color-foreground)] cursor-pointer"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[var(--color-foreground)] block text-[13px] font-semibold">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        {...field}
                        {...form.register("name", {
                          required: "required",
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[var(--color-foreground)] block text-[13px] font-semibold">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        {...field}
                        {...form.register("email", {
                          required: "required",
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[var(--color-foreground)] block text-[13px] font-semibold">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                        {...form.register("password", {
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
                variant="primary"
                type="submit"
                className="w-full flex justify-center border border-transparent"
                disabled={loading}
              >
                Send verification code
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

const RegisterPage = () => {
  return (
    <Layout backgroundImage={RegisterImage}>
      <Register />
    </Layout>
  );
};

export default RegisterPage;
