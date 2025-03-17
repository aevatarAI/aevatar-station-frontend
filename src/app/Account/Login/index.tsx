import { service } from "@/api/axios";
import Layout from "@/app/Account/Layout";
import robotImg1 from "@/assets/overview/robot1.png";
import robotImg2 from "@/assets/overview/robot2.png";
import robotImg3 from "@/assets/overview/robot3.png";
import robotImg4 from "@/assets/overview/robot4.png";
import ForgotPasswordDialog from "@/components/ForgotPasswordDialog";
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
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { login } from "@/services/auth";
import { accessTokenAtom } from "@/state/atoms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useCallback, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const images = [robotImg1, robotImg2, robotImg3, robotImg4];
const formSchema = z.object({
  username: z.string().email({
    message: "please enter a valid email address.",
  }),
  password: z
    .string()
    .min(8, "password must be at least 8 characters long")
    .regex(
      /[^a-zA-Z0-9]/,
      "password must contain at least one non-alphanumeric character"
    )
    .regex(
      /[a-z]/,
      "password must contain at least one lowercase letter ('a'-'z')"
    )
    .regex(
      /[A-Z]/,
      "password must contain at least one uppercase letter ('A'-'Z')"
    ),
});

const Login = () => {
  const { toast } = useToast();
  const [_, setAccessToken] = useAtom(accessTokenAtom);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const getUserProfile = useUpdateProfile();

  const navigate = useNavigate();
  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      setLoading(true);
      const { username, password } = values;
      try {
        const data = await login(username, password);
        const accessToken = `${data.token_type} ${data.access_token}`;
        service.defaults.headers.Authorization = accessToken;

        setAccessToken(accessToken);
        getUserProfile();
        navigate("/welcome");
      } catch (err) {
        console.error(err, "err");
        toast({
          description: "Login failed. Please check your username and password.",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast, setAccessToken, navigate, getUserProfile]
  );

  return (
    <div className=" flex flex-col text-white w-full lg:w-[408px] gap-4">
      <div className="gap-3 flex-col flex">
        <h2 className="text-[18px] font-semibold">login</h2>
        <p className="text-gray-light font-normal text-[12px] font-source-code">
          not a member yet?&nbsp;
          <span
            className="font-normal text-white cursor-pointer font-source-code"
            onClick={() => {
              navigate("/register");
            }}>
            register
          </span>
        </p>
      </div>
      <div className="h-[1px] bg-black-light w-full" />
      <div className="text-gray-light">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="gap-5 flex flex-col">
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-[12px] font-semibold">
                      email address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        {...form.register("username", {
                          required: "required",
                        })}
                        placeholder="enter your email"
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
                        type="password"
                        placeholder="password"
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
                disabled={loading}>
                {loading ? "logging in" : "log in"}
              </Button>
            </div>
          </form>
        </Form>
        <div className="text-right">
          <ForgotPasswordDialog />
        </div>
      </div>
    </div>
  );
};
const LoginPage = () => {
  const randomImage = useMemo(
    () => images[Math.floor(Math.random() * images.length)],
    []
  );
  return (
    <Layout backgroundImage={randomImage}>
      <Login />
    </Layout>
  );
};
export default LoginPage;
