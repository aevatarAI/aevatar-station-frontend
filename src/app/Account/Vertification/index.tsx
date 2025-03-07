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
import React from "react";
import { useForm } from "react-hook-form";
const Verification = () => {
  const form = useForm();

  function onSubmit(values: any) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="flex flex-col text-white  w-full lg:w-[408px] gap-4">
      <div className="gap-3 flex-col flex">
        <h2 className="text-[18px] font-semibold">verification</h2>
        <p className="text-[#B9B9B9] font-normal text-[12px]">
          already registered? &nbsp;
          <span className="font-normal text-white">login</span>
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
                name="verificationCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-[12px] font-semibold">
                      Verification Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter verification code"
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
                register
              </Button>
              <div className="text-right">
                <span className="text-[12px]">resend email</span>
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
