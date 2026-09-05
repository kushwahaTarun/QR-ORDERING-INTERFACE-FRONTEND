export function EmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div role="status" className="max-w-lg py-16">
      <h2 className="font-heading text-3xl">{title}</h2>
      <div className="rule-left mt-4 max-w-20" />
      <p className="mt-5 text-[16px] leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
