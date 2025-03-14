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
import { register, sendRegisterCode } from "@/services/auth";
import { emailAtom, passwordAtom, usernameAtom } from "@/state/atoms";
import { sleep } from "@etransfer/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSetAtom } from "jotai";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string(),
  email: z.string().email({
    message: "please enter a valid email address.",
  }),
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
        const response = await sendRegisterCode(email);
        setName(name);
        setEmail(email);
        setPassword(password);
        toast({
          description: response.message || "Send Register Code successful!",
        });
        await sleep(2000);
        setLoading(false);
        navigate("/verification");
      } catch (error) {
        toast({
          description: "Send Register Code failed. Please try again.",
        });
        setLoading(false);
      }
    },
    [toast, navigate, setName, setEmail, setPassword],
  );

  return (
    <div className="flex flex-col text-white w-full lg:w-[408px] gap-4">
      <div className="gap-3 flex-col flex">
        <h2 className="text-[18px] font-semibold">register</h2>
        <p className="text-gray-light font-normal text-[12px] font-source-code">
          already registered?&nbsp;
          <span
            className="font-normal text-white cursor-pointer"
            onClick={() => {
              navigate("/login");
            }}
          >
            login
          </span>
        </p>
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-[12px] font-semibold">
                      name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="enter your name"
                        {...field}
                        {...form.register("name", {
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-[12px] font-semibold">
                      email address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        {...field}
                        {...form.register("email", {
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-[12px] font-semibold">
                      password
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
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
            </div>

            <div className="flex flex-col gap-[10px]">
              <Button
                type="submit"
                className="w-full flex justify-center border border-transparent bg-white text-black-light"
                disabled={loading}
              >
                send verification code
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
