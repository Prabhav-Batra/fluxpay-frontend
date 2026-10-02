import type { ReactNode } from 'react';

/** One label/value pair in a {@link DetailList}. */
export interface DetailItem {
  label: string;
  value: ReactNode;
}

/** Two-column definition list for resource detail pages. */
export function DetailList({ items }: { items: DetailItem[] }) {
  return (
    <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[12rem_1fr]">
      {items.map((item) => (
        <div key={item.label} className="contents">
          <dt className="text-muted-foreground">{item.label}</dt>
          <dd className="min-w-0 break-words">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
