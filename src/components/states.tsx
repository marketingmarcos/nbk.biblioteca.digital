import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

export function LoadingState({ label = "Carregando a estante…" }: { label?: string }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 sm:px-6" role="status">
      <div className="h-8 w-48 animate-pulse rounded-md bg-surface" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="aspect-[2/3] animate-pulse rounded-xl bg-surface" />
        ))}
      </div>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

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
    <div className="rounded-xl border border-line bg-surface px-6 py-12 text-center">
      <h2 className="text-xl font-medium">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{body}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-danger/40 bg-surface px-6 py-10 text-center" role="alert">
      <h2 className="text-lg font-medium">Algo saiu do eixo</h2>
      <p className="mx-auto mt-2 max-w-md break-words text-sm text-muted">{message}</p>
    </div>
  );
}

export function NotFoundState({
  title = "Não encontramos esta página",
  body = "O endereço pode ter mudado, ou a obra ainda não está publicada.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <EmptyState
      title={title}
      body={body}
      action={
        <Link to="/catalogo" search={{ q: "", categoria: "" }} className={buttonVariants()}>
          Ir ao catálogo
        </Link>
      }
    />
  );
}
