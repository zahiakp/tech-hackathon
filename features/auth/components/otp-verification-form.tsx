"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import { useState, type FormEvent } from "react";

import { FormField } from "@/components/forms/form-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ApiClientError, apiFetch } from "@/lib/api-client";

type OtpPurpose = "EMAIL_VERIFICATION" | "PASSWORD_RESET";

type OtpVerificationFormProps = {
  email: string;
  purpose: OtpPurpose;
};

export function OtpVerificationForm({
  email,
  purpose,
}: OtpVerificationFormProps) {
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const result = await apiFetch<{
        verified: boolean;
        resetToken?: string;
      }>("/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ email, purpose, code }),
      });

      if (purpose === "PASSWORD_RESET" && result.data.resetToken) {
        setResetToken(result.data.resetToken);
        setMessage("Code verified. Create a new password.");
      } else {
        setComplete(true);
        setMessage("Your email address has been verified.");
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiClientError
          ? caughtError.message
          : "Unable to verify the code. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch<{ reset: boolean }>("/auth/password/reset", {
        method: "POST",
        body: JSON.stringify({ token: resetToken, password }),
      });
      setComplete(true);
      setMessage("Your password has been reset. You can now sign in.");
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiClientError
          ? caughtError.message
          : "Unable to reset the password. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function resendCode() {
    setError("");
    setMessage("");
    setIsSubmitting(true);
    try {
      await apiFetch<{ sent: boolean }>("/auth/otp/request", {
        method: "POST",
        body: JSON.stringify({ email, purpose }),
      });
      setMessage("A new verification code has been requested.");
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiClientError
          ? caughtError.message
          : "Unable to request another code.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!email) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          An email address is required. Return to password recovery and request
          a new code.
        </AlertDescription>
      </Alert>
    );
  }

  if (complete) {
    return (
      <div className="grid gap-5 text-center">
        <CheckCircle2 className="mx-auto size-12 text-emerald-600" />
        <p className="text-sm text-muted-foreground">{message}</p>
        <Link
          className="font-semibold text-primary underline-offset-4 hover:underline"
          href="/login"
        >
          Continue to sign in
        </Link>
      </div>
    );
  }

  if (resetToken) {
    return (
      <form className="grid gap-5" onSubmit={resetPassword}>
        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        <FormField id="new-password" label="New password" required>
          <Input
            autoComplete="new-password"
            id="new-password"
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </FormField>
        <FormField id="confirm-password" label="Confirm password" required>
          <Input
            autoComplete="new-password"
            id="confirm-password"
            minLength={8}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            type="password"
            value={confirmPassword}
          />
        </FormField>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button
          disabled={
            isSubmitting ||
            password.length < 8 ||
            confirmPassword.length < 8
          }
          type="submit"
        >
          {isSubmitting && <LoaderCircle className="animate-spin" />}
          Reset password
        </Button>
      </form>
    );
  }

  return (
    <form className="grid gap-5" onSubmit={verifyCode}>
      <p className="text-center text-sm text-muted-foreground">
        Enter the six-digit code sent to <strong>{email}</strong>.
      </p>
      <FormField id="otp" label="Verification code" required>
        <InputOTP
          id="otp"
          maxLength={6}
          onChange={setCode}
          required
          value={code}
        >
          <InputOTPGroup className="w-full justify-center">
            {Array.from({ length: 6 }, (_, index) => (
              <InputOTPSlot
                className="size-11 flex-1 text-base sm:flex-none"
                index={index}
                key={index}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </FormField>
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button disabled={isSubmitting || code.length !== 6} type="submit">
        {isSubmitting && <LoaderCircle className="animate-spin" />}
        Verify code
      </Button>
      <div className="flex flex-col items-center gap-2 text-sm">
        <Button
          disabled={isSubmitting}
          onClick={resendCode}
          size="sm"
          type="button"
          variant="ghost"
        >
          <RefreshCw />
          Resend code
        </Button>
        <Link
          className="inline-flex items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline"
          href="/login"
        >
          <ArrowLeft className="size-4" />
          Back to sign in
        </Link>
      </div>
    </form>
  );
}
