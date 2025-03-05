import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type React from "react";
import { useState } from "react";

const Verification: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  const handleResendEmail = () => {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Verification Code
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="verificationCode"
            >
              Verification Code
            </label>
            <Input
              id="verificationCode"
              type="text"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
          >
            Register
          </Button>
        </form>
        <Button
          onClick={handleResendEmail}
          className="w-full bg-gray-600 hover:bg-gray-700"
        >
          Resend Email
        </Button>
        <p className="mt-4 text-center">
          Already registered?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Verification;
