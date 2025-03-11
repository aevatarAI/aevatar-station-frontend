import Layout from "@/app/Account/Layout";
import LoginImage from "@/assets/login.png";
import ForgotPasswordDialog from "@/components/ForgotPasswordDialog";
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
import { useNavigate } from "@/hooks/navigate";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/services/auth";
import { accessTokenAtom } from "@/state/atoms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const Login = () => {
  const { toast } = useToast();
  const setAccessToken = useSetAtom(accessTokenAtom);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      setLoading(true);
      const { username, password } = values;
      try {
        const { data } = await login(username, password);
        setAccessToken(data.access_token);
        console.log("Login successful!");
      } catch (err) {
        toast({
          description: "Login failed. Please check your credentials.",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast, setAccessToken],
  );

  const navigate = useNavigate();
  return (
    <div className=" flex flex-col text-white w-full lg:w-[408px] gap-4">
      <div className="gap-3 flex-col flex">
        <h2 className="text-[18px] font-semibold">login</h2>
        <p className="text-[#B9B9B9] font-normal text-[12px]">
          not a member yet? &nbsp;
          <span
            className="font-normal text-white cursor-pointer"
            onClick={() => {
              navigate("/register");
            }}
          >
            register
          </span>
        </p>
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-[12px] font-semibold">
                      email address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-[12px] font-semibold">
                      password
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
                {loading ? "logging in" : "log in"}
              </Button>
              <div className="text-right">
                <ForgotPasswordDialog />
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
const LoginPage = () => {
  return (
    <Layout backgroundImage={LoginImage}>
      <Login />
    </Layout>
  );
};
export default LoginPage;
