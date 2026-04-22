export function StatusBadge({
  status,
}: {
  status: "confirmed" | "pending" | "cancelled";
}) {
  const styles = {
    confirmed: "bg-accent/10 text-accent",
    pending: "bg-muted text-muted-foreground",
    cancelled: "bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
}