import DescHome from "@/components/DescHome";
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

const ResetPassword = () => {
  const form = useForm();
  function onSubmit(values: any) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <div className=" flex flex-col text-white w-full lg:w-[426px] gap-4">
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
    <div className="relative flex justify-center px-[47px]">
      <div className="mt-[178px] flex  flex-col gap-[30px]">
        <DescHome className="items-start lg:items-center" />
        <div className="h-[1px] w-full bg-black-light" />
        <ResetPassword />
      </div>
    </div>
  );
};
export default ResetPasswordPage;
