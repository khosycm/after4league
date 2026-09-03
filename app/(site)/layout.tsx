import { NavBar } from "@/components/site/nav-bar";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex flex-1 flex-col">
      <NavBar />
      <main className="mx-auto w-full max-w-5xl flex-1 p-6">{children}</main>
      <footer className="border-t border-card-border p-6 text-center text-sm text-muted">
        After4 League — office eFootball tournament
      </footer>
    </div>
  );
}
