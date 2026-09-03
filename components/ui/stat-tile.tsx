export function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-card-border bg-card p-3 text-center">
      <p className="font-heading text-2xl font-bold tabular-nums text-navy">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}
