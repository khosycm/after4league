import Link from "next/link";
import { requireAdminPage } from "@/lib/auth-guard";
import { Button } from "@/components/ui/button";
import { signOutAction } from "./actions";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdminPage();

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-card-border bg-navy text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 p-4">
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 font-heading text-sm font-semibold uppercase tracking-wide">
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/players">Players</Link>
            <Link href="/admin/seasons">Seasons</Link>
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-white/70 sm:inline">{admin.email}</span>
            <form action={signOutAction}>
              <Button type="submit" variant="outline" size="sm" className="border-white/30 bg-transparent text-white hover:bg-white/10">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-8">{children}</main>
    </div>
  );
}
