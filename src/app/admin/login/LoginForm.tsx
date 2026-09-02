"use client";

import { loginAction } from "@/actions/admin/auth";
import { Button } from "@/components/ui/Button";
import { FormField, inputClassName } from "@/components/admin/FormField";
import { siteConfig } from "@/config/site";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setError(null);
    const result = await loginAction(data);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-semibold text-ink">
            {siteConfig.businessName}
          </h1>
          <p className="mt-2 text-sm text-taupe">Admin sign in</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-xl border border-taupe/20 bg-white p-8 shadow-sm"
        >
          {error ? (
            <div
              className="mb-6 rounded-lg border border-dusty-rose/30 bg-red-50 px-4 py-3 text-sm text-dusty-rose"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          <div className="space-y-5">
            <FormField
              label="Email"
              htmlFor="email"
              required
              error={errors.email?.message}
            >
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className={inputClassName}
              />
            </FormField>

            <FormField
              label="Password"
              htmlFor="password"
              required
              error={errors.password?.message}
            >
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
                className={inputClassName}
              />
            </FormField>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={isSubmitting}
            className="mt-8"
          >
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
