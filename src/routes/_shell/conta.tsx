import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { LoadingState } from "@/components/states";
import { StatusPill } from "@/components/status-pill";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ensureProfile, getAccount, updateProfile } from "@/lib/nebbook/account.functions";
import { ROLE_LABEL } from "@/lib/nebbook/editorial";
import { formatDate } from "@/lib/nebbook/format";
import type { AccountSnapshot } from "@/lib/nebbook/types";

export const Route = createFileRoute("/_shell/conta")({
  head: () => ({ meta: [{ title: "Sua conta · Nebbook" }] }),
  component: AccountPage,
});

function AccountPage() {
  const { user, isPending } = useCurrentUserState();
  const [account, setAccount] = useState<AccountSnapshot | null>(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  useEffect(() => {
    if (!user) return;
    const intent = sessionStorage.getItem("nebbook-intent") === "author" ? "author" : "reader";
    sessionStorage.removeItem("nebbook-intent");
    let cancel = false;
    ensureProfile({ data: { intent } })
      .then(() => getAccount())
      .then((snapshot) => { if (!cancel) setAccount(snapshot); })
      .catch((reason: unknown) => { if (!cancel) setError(reason instanceof Error ? reason.message : "Não foi possível abrir a conta."); });
    return () => { cancel = true; };
  }, [user?.id]);

  if (isPending || (user && !account && !error)) return <LoadingState label="Abrindo a sua estante…" />;
  if (!user) return <RedirectToSignIn />;
  if (!account) return <main className="mx-auto max-w-xl px-4 py-16 text-sm text-danger">{error}</main>;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSaved("");
    updateProfile({ data: { displayName: String(data.get("name") || ""), bio: String(data.get("bio") || "") } })
      .then(() => setSaved("Perfil atualizado."))
      .catch((reason: unknown) => setSaved(reason instanceof Error ? reason.message : "Não salvou."));
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-sm text-cyan">{ROLE_LABEL[account.role]}</p>
      <h1 className="mt-2 text-4xl font-medium tracking-tight">{account.displayName}</h1>
      <p className="mt-1 text-sm text-muted">{account.email}</p>
      {account.needsBootstrap ? (
        <p className="mt-4 rounded-md border border-line bg-surface px-4 py-3 text-sm">
          Esta instalação ainda não tem administrador. <Link to="/admin" className="text-cyan">Assumir a equipe</Link> é uma ação única e fica registrada.
        </p>
      ) : null}
      {(account.role === "admin" || account.role === "editor") && !account.needsBootstrap ? (
        <p className="mt-4"><Link to="/admin" className="text-sm text-cyan">Abrir o painel editorial</Link></p>
      ) : null}
      <form onSubmit={onSubmit} className="mt-8 space-y-3 rounded-xl border border-line bg-surface p-5">
        <label className="block text-sm">Nome público
          <Input name="name" defaultValue={account.displayName} className="mt-1" />
        </label>
        <label className="block text-sm">Bio
          <Textarea name="bio" defaultValue={account.bio} className="mt-1" />
        </label>
        <Button type="submit">Salvar perfil</Button>
        {saved ? <p className="text-sm text-muted">{saved}</p> : null}
      </form>
      <section className="mt-10">
        <h2 className="text-xl font-medium">Continuar lendo</h2>
        {account.progress.length === 0 ? <p className="mt-2 text-sm text-muted">Nenhum ponto salvo ainda.</p> : (
          <ul className="mt-3 space-y-2">
            {account.progress.map((item) => (
              <li key={item.slug}>
                <Link to="/ler/$slug" params={{ slug: item.slug }} className="flex min-h-11 items-center justify-between gap-3 text-sm">
                  <span>{item.title}</span>
                  <span className="tabular-nums text-muted">{item.progressPct}% · {formatDate(item.updatedAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="mt-10">
        <h2 className="text-xl font-medium">Marcas</h2>
        {account.bookmarks.length === 0 ? <p className="mt-2 text-sm text-muted">Nenhuma marca ainda.</p> : (
          <ul className="mt-3 space-y-2 text-sm">
            {account.bookmarks.map((item) => (
              <li key={item.id}>
                <Link to="/ler/$slug" params={{ slug: item.slug }} className="hover:underline">{item.title}</Link>
                <span className="text-muted"> · {item.locator}{item.note ? ` · ${item.note}` : ""}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Seus originais</h2>
          <Link to="/enviar" className="text-sm text-cyan">Enviar</Link>
        </div>
        {account.books.length === 0 ? <p className="mt-2 text-sm text-muted">Você ainda não enviou uma obra.</p> : (
          <ul className="mt-3 space-y-3">
            {account.books.map((item) => (
              <li key={item.slug} className="flex flex-wrap items-center justify-between gap-2">
                <Link to="/livros/$slug" params={{ slug: item.slug }} className="text-sm hover:underline">{item.title}</Link>
                <StatusPill status={item.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
