import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Proxy only performs an optimistic redirect on page navigation — it does not
 * protect Server Actions, which remain independently callable — so every
 * admin mutation and admin-only data fetch must re-verify the session itself.
 */
export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

/** Same check for a page/layout, redirecting instead of throwing. */
export async function requireAdminPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }
  return session.user;
}
