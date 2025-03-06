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
import React from "react";
import { useForm } from "react-hook-form";

const Login = () => {
  const form = useForm();
  function onSubmit(values: any) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <div className=" flex flex-col text-white w-[408px] gap-4">
      <div className="gap-3 flex-col flex">
        <h2 className="text-[18px] font-semibold">login</h2>
        <p className="text-[#B9B9B9] font-normal text-[12px]">
          not a member yet? &nbsp;
          <span className="font-normal text-white">register</span>
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
              >
                log in
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
    <div className="relative">
      <div className="mt-[190px] ml-[114px]">
        <Login />
      </div>
    </div>
  );
};
export default LoginPage;
