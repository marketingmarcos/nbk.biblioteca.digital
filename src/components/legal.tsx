import type { ReactNode } from "react";

export function Legal({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <p className="text-sm text-cyan">Institucional</p>
      <h1 className="mt-2 text-4xl font-medium tracking-tight">{title}</h1>
      <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">{children}</div>
    </main>
  );
}
