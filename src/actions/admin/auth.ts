"use server";

import { AuthError } from "next-auth";
import { headers } from "next/headers";
import type { ActionResponse } from "@/types/actions";
import { signIn, signOut } from "@/lib/auth";
import { API_RATE_LIMITS, rateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validations/auth";

export async function loginAction(
  input: unknown,
): Promise<ActionResponse<{ callbackUrl?: string }>> {
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";

  const limit = rateLimit(`auth:${ip}`, API_RATE_LIMITS.auth);
  if (!limit.success) {
    return {
      success: false,
      error: "Too many login attempts. Please try again later.",
    };
  }

  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid email or password." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    return { success: true, data: {} };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: "Invalid email or password." };
    }
    console.error("loginAction error:", error);
    return { success: false, error: "Unable to sign in. Please try again." };
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
