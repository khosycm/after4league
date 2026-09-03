import Link from "next/link";

const NAV_LINKS = [
  { href: "/standings", label: "Table" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/players", label: "Players" },
  { href: "/leaderboards", label: "Leaderboards" },
  { href: "/seasons", label: "Seasons" },
];

export function NavBar() {
  return (
    <header className="border-b border-card-border bg-navy text-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="font-heading text-xl font-bold uppercase tracking-wide">
          After4 League
        </Link>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 font-heading text-sm font-semibold uppercase tracking-wide text-white/80">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
