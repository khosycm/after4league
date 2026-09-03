"use client";

import { Button } from "@/components/ui/button";

export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-navy">Something went wrong</h1>
      <p className="text-sm text-muted">Try again, or head back to the homepage.</p>
      <Button onClick={() => retry()} variant="outline" size="sm">
        Try again
      </Button>
    </div>
  );
}
