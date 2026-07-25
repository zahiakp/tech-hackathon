"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, Send } from "lucide-react";
import { useState, type FormEvent } from "react";

import { FormField } from "@/components/forms/form-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiClientError, apiFetch } from "@/lib/api-client";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await apiFetch<{ sent: boolean }>("/auth/otp/request", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          purpose: "PASSWORD_RESET",
        }),
      });
      router.push(
        `/otp?email=${encodeURIComponent(email.trim())}&purpose=PASSWORD_RESET`,
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiClientError
          ? caughtError.message
          : "Unable to request a reset code. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <FormField
        description="Use the email address associated with your account."
        id="reset-email"
        label="Email"
        required
      >
        <Input
          autoComplete="email"
          className="h-11"
          id="reset-email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />
      </FormField>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        className="h-11 w-full"
        disabled={isSubmitting || !email.trim()}
        type="submit"
      >
        {isSubmitting ? <LoaderCircle className="animate-spin" /> : <Send />}
        {isSubmitting ? "Requesting code..." : "Send reset code"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link
          className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline"
          href="/login"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Sign in
        </Link>
      </p>
    </form>
  );
}
