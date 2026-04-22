export function ModalField({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs font-medium text-foreground mb-2 block uppercase tracking-wider">
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-muted/60 border border-border/40 rounded-md px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/30"
      />
    </div>
  );
}