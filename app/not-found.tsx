import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
      <p className="font-heading text-sm font-semibold uppercase tracking-wide text-accent">404</p>
      <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-navy">Not found</h1>
      <p className="text-sm text-muted">That page doesn&apos;t exist.</p>
      <Link href="/" className="mt-2 text-sm font-medium text-accent hover:underline">
        Back to home
      </Link>
    </div>
  );
}
