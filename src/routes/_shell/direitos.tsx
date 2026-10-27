import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Legal } from "@/components/legal";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { fileNotice } from "@/lib/nebbook/account.functions";
import { listCatalog } from "@/lib/nebbook/public.functions";

type RightsSearch = { obra: string };

export const Route = createFileRoute("/_shell/direitos")({
  validateSearch: (search: Record<string, unknown>): RightsSearch => ({
    obra: typeof search.obra === "string" ? search.obra.slice(0, 160) : "",
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const books = await listCatalog({ data: { q: "", categoria: "" } });
    return { books, obra: deps.obra };
  },
  head: () => ({ meta: [{ title: "Direitos autorais · Nebbook" }] }),
  component: RightsPage,
});

function RightsPage() {
  const { books, obra } = Route.useLoaderData();
  const selected = books.some((book) => book.slug === obra) ? obra : "";

  return (
    <Legal title="Direitos autorais">
      <p>O autor permanece titular da obra. Enviar um original não transfere a propriedade para a Nebbook.</p>
      <p>Ao submeter, o autor confirma que pode oferecer o texto e concede uma licença não exclusiva para a equipe avaliar o arquivo e, somente se a obra for publicada, exibi-la na estante e permitir a leitura. O download só existe se essa opção estiver marcada e a obra estiver publicada.</p>
      <p>Aprovar não liga essa licença de exibição pública. A publicação é uma decisão separada, feita por editor ou administrador que não seja o autor da obra.</p>
      <p>Arquivar tira a obra do catálogo. Isso não apaga, por si, o registro de direitos.</p>
      <p>Os textos marcados como demonstração foram escritos para esta plataforma. Não representam cessão de um autor externo.</p>
      <p>Se uma obra publicada ferir direitos de terceiros, use o formulário abaixo. A notificação entra na fila da equipe. Ela não tira o livro do ar sozinha: arquivar continua sendo uma decisão editorial registrada.</p>
      <NoticeForm books={books} initialSlug={selected} />
    </Legal>
  );
}

function NoticeForm({
  books,
  initialSlug,
}: {
  books: { slug: string; title: string }[];
  initialSlug: string;
}) {
  const { user, isPending } = useCurrentUserState();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setMessage("");
    setError("");
    setPending(true);
    fileNotice({
      data: {
        bookSlug: String(data.get("obra") || ""),
        claimantName: String(data.get("nome") || ""),
        workReference: String(data.get("referencia") || ""),
        statement: String(data.get("relato") || ""),
      },
    })
      .then(() => {
        setMessage("Notificação registrada. A equipe vê o relato no painel, com o e-mail da sua conta.");
        event.currentTarget.reset();
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Não foi possível registrar."))
      .finally(() => setPending(false));
  }

  return (
    <section className="mt-8 rounded-xl border border-line bg-surface p-5 text-fg">
      <h2 className="font-sans text-lg font-medium text-fg">Notificar uma obra</h2>
      <p className="mt-2 text-sm">Conta obrigatória. O contato usado é o e-mail com que você entrou. Não envie senha nem documento aqui.</p>
      {isPending ? <p className="mt-4 text-sm">Verificando a sessão…</p> : null}
      {!isPending && !user ? (
        <p className="mt-4 text-sm">
          <Link to="/login" className="text-cyan">Entre na conta</Link> para enviar a notificação.
        </p>
      ) : null}
      {user ? (
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <label className="block text-sm text-fg">Obra na estante
            <select name="obra" defaultValue={initialSlug} className="mt-1 min-h-11 w-full rounded-md border border-line bg-bg px-3 text-sm text-fg">
              <option value="">Não está listada, ou não sei o endereço</option>
              {books.map((book) => (
                <option key={book.slug} value={book.slug}>{book.title}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-fg">Quem reclama a titularidade
            <Input name="nome" className="mt-1" required minLength={2} maxLength={80} autoComplete="name" />
          </label>
          <label className="block text-sm text-fg">Obra original
            <Input name="referencia" className="mt-1" required minLength={4} maxLength={160} placeholder="Título, autor e onde a obra original pode ser conferida" />
          </label>
          <label className="block text-sm text-fg">Relato
            <Textarea name="relato" className="mt-1" required minLength={40} maxLength={2000} placeholder="O que foi usado sem autorização, e o que você pede que a equipe faça." />
          </label>
          <Button type="submit" disabled={pending}>{pending ? "Enviando…" : "Registrar notificação"}</Button>
          {message ? <p className="text-sm text-ok">{message}</p> : null}
          {error ? <p className="text-sm text-danger">{error}</p> : null}
        </form>
      ) : null}
    </section>
  );
}
