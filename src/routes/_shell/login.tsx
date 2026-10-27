import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { brand } from "@/lib/nebbook/brand";

export const Route = createFileRoute("/_shell/login")({
  head: () => ({ meta: [{ title: `Entrar · ${brand.name}` }] }),
  component: LoginPage,
});

function LoginPage() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"entrar" | "criar">("entrar");
  const [author, setAuthor] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "").trim().toLowerCase();
    const password = String(data.get("password") || "");
    const name = String(data.get("name") || "").trim();
    if (!email.includes("@") || password.length < 8) {
      setError("Use um e-mail válido e uma senha com pelo menos 8 caracteres.");
      return;
    }
    if (mode === "criar" && name.length < 2) {
      setError("Diga como você quer ser chamado.");
      return;
    }
    sessionStorage.setItem("nebbook-intent", author ? "author" : "reader");
    setPending(true);
    const result = mode === "criar"
      ? await authClient.signUp.email({ email, password, name, callbackURL: "/conta" })
      : await authClient.signIn.email({ email, password, callbackURL: "/conta" });
    setPending(false);
    if (result.error) {
      sessionStorage.removeItem("nebbook-intent");
      setError(result.error.message || "Não foi possível entrar.");
      return;
    }
    await navigate({ to: "/conta" });
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-col px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-medium tracking-tight">{mode === "criar" ? "Criar conta" : "Entrar"}</h1>
      <p className="mt-2 text-sm text-muted">A conta é real. Não há usuário de demonstração.</p>
      {isPending ? <div className="mt-6 h-11 animate-pulse rounded-md bg-surface" /> : null}
      {!isPending && user ? (
        <p className="mt-6 text-sm">Você já está na conta. <Link to="/conta" className="text-cyan">Ir para a área do leitor</Link></p>
      ) : null}
      {!authEnabled ? <p className="mt-6 text-sm text-danger">O acesso está desligado nesta instalação.</p> : null}
      {authEnabled && !user ? (
        <>
          <div className="mt-6 grid grid-cols-2 gap-2">
            <button type="button" className={tab(mode === "entrar")} onClick={() => setMode("entrar")}>Entrar</button>
            <button type="button" className={tab(mode === "criar")} onClick={() => setMode("criar")}>Criar conta</button>
          </div>
          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            {mode === "criar" ? (
              <label className="block text-sm">Nome
                <Input name="name" autoComplete="name" className="mt-1" required />
              </label>
            ) : null}
            <label className="block text-sm">E-mail
              <Input name="email" type="email" autoComplete="email" className="mt-1" required />
            </label>
            <label className="block text-sm">Senha
              <Input name="password" type="password" autoComplete={mode === "criar" ? "new-password" : "current-password"} className="mt-1" required minLength={8} />
            </label>
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input type="checkbox" checked={author} onChange={(event) => setAuthor(event.target.checked)} />
              Quero enviar obras como autor
            </label>
            {error ? <p className="text-sm text-danger" role="alert">{error}</p> : null}
            <Button type="submit" disabled={pending} className="w-full">{pending ? "Aguarde…" : mode === "criar" ? "Criar conta" : "Entrar"}</Button>
          </form>
          <div className="my-6 flex items-center gap-3 text-xs text-subtle">
            <span className="h-px flex-1 bg-line" />
            ou
            <span className="h-px flex-1 bg-line" />
          </div>
          <div className="space-y-2">
            {GROK_PROVIDERS.map((provider) => (
              <Button
                key={provider.providerId}
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => {
                  sessionStorage.setItem("nebbook-intent", author ? "author" : "reader");
                  void signIn(provider.providerId, { callbackURL: "/conta" });
                }}
              >
                Continuar com {provider.label}
              </Button>
            ))}
          </div>
        </>
      ) : null}
    </main>
  );
}

function tab(active: boolean) {
  return `min-h-11 rounded-full text-sm ${active ? "bg-surface-2 text-fg" : "text-muted"}`;
}
