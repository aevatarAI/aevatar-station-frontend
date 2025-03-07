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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

const ForgotPasswordDialog = () => {
  const [email, setEmail] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the submission logic here
    console.log("Email submitted:", email);
  };
  const [isSubmitted, setIsSubmitted] = useState(true);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-[12px] cursor-pointer">forgot password?</span>
      </DialogTrigger>
      <DialogContent className="max-w-[328px] p-5 flex flex-col gap-7">
        <DialogHeader>
          <DialogTitle className="text-gradient inline">
            forgot Password?
          </DialogTitle>
        </DialogHeader>
        {isSubmitted ? (
          <div>
            <DialogDescription className="mb-7">
              an account recovery email has been sent. if you don’t see it in 15
              minutes, check your junk folder and mark it as ‘not junk’.
            </DialogDescription>
            <div className="flex justify-between items-center">
              <DialogClose asChild>
                <Button
                  type="button"
                  className="text-white text-[12px] px-[16px] py-[8px]"
                >
                  back to Login
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-white text-black-light text-[12px] px-[16px] py-[8px]"
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-7">
              <div className="space-y-2">
                <Label htmlFor="email">email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="placeholder:text-gray-deep border-black-light text-white"
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="text-white text-[12px] px-[16px] py-[8px]"
                  >
                    back to Login
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="bg-white text-[12px] text-black-light px-[16px] py-[8px]"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
