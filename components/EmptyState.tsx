import type { ReactNode } from "react";

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-hairline bg-surface px-5 py-8 text-center">
      <p className="font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-ink-soft">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
