export function FolioStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-[7.5rem]">
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-primary/90">
        {label}
      </p>
      <p className="folio-num mt-2 text-4xl leading-none sm:text-5xl">{value}</p>
    </div>
  );
}
