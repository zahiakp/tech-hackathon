"use client";

import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AlertCircle, ArrowRight, LoaderCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { landingPathForRoles } from "@/lib/auth-landing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      if (isRegister) {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const result = (await response.json()) as { error?: string };

        if (!response.ok) {
          setError(result.error ?? "Registration failed.");
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(
          isRegister
            ? "Your account was created, but automatic sign-in failed. Please sign in."
            : "Invalid email or password.",
        );
        return;
      }

      const session = await getSession();
      router.replace(landingPathForRoles(session?.user.roles ?? []));
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      {isRegister && (
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            autoComplete="name"
            className="h-11"
            id="name"
            minLength={2}
            name="name"
            placeholder="Your name"
            required
            type="text"
          />
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          autoComplete="email"
          className="h-11"
          id="email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="password">Password</Label>
          {!isRegister && (
            <Link
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              href="/forgot-password"
            >
              Forgot password?
            </Link>
          )}
        </div>
        <Input
          autoComplete={isRegister ? "new-password" : "current-password"}
          className="h-11"
          id="password"
          minLength={8}
          name="password"
          placeholder="At least 8 characters"
          required
          type="password"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button className="h-11 w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? (
          <>
            <LoaderCircle className="animate-spin" />
            Please wait
          </>
        ) : (
          <>
            {isRegister ? "Create account" : "Sign in"}
            <ArrowRight />
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {isRegister ? "Already have an account?" : "New here?"}{" "}
        <Link
          className="font-semibold text-primary underline-offset-4 hover:underline"
          href={isRegister ? "/login" : "/register"}
        >
          {isRegister ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
