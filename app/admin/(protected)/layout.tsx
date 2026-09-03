import Link from "next/link";
import { requireAdminPage } from "@/lib/auth-guard";
import { Button } from "@/components/ui/button";
import { signOutAction } from "./actions";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdminPage();

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-card-border bg-navy text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 p-4">
          <nav className="flex items-center gap-6 font-heading text-sm font-semibold uppercase tracking-wide">
            <Link href="/admin">Dashboard</Link>
            <Link href="/admin/players">Players</Link>
            <Link href="/admin/seasons">Seasons</Link>
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-white/70">{admin.email}</span>
            <form action={signOutAction}>
              <Button type="submit" variant="outline" size="sm" className="border-white/30 bg-transparent text-white hover:bg-white/10">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 p-8">{children}</main>
    </div>
  );
}
