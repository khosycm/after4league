import type { MatchOutcome } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

const STYLES: Record<MatchOutcome, string> = {
  W: "bg-win-surface text-win",
  D: "bg-draw-surface text-draw",
  L: "bg-loss-surface text-loss",
};

export function ResultBadge({ result, className }: { result: MatchOutcome; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded font-heading text-xs font-bold",
        STYLES[result],
        className,
      )}
    >
      {result}
    </span>
  );
}
