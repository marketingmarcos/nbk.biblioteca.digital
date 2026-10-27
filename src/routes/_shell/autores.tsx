import { createFileRoute, Link } from "@tanstack/react-router";
import { EmptyState } from "@/components/states";
import { Badge } from "@/components/ui/badge";
import { listAuthors } from "@/lib/nebbook/public.functions";

export const Route = createFileRoute("/_shell/autores")({
  loader: () => listAuthors(),
  head: () => ({ meta: [{ title: "Autores · Nebbook" }] }),
  component: AuthorsPage,
});

function AuthorsPage() {
  const authors = Route.useLoaderData();
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-4xl font-medium tracking-tight">Autores</h1>
      <p className="mt-2 max-w-xl text-muted">Quem tem pelo menos uma obra publicada. Perfis fictícios do acervo demonstrativo estão marcados.</p>
      {authors.length === 0 ? (
        <div className="mt-8"><EmptyState title="Nenhum autor publicado" body="Quando uma obra for publicada, a pessoa autora aparece aqui." /></div>
      ) : (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {authors.map((author) => (
            <li key={author.slug}>
              <Link to="/autores/$slug" params={{ slug: author.slug }} className="block rounded-xl border border-line bg-surface p-5 hover:bg-surface-2">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-medium">{author.name}</h2>
                  {author.isDemonstrative ? <Badge>Demonstração</Badge> : null}
                </div>
                <p className="mt-2 text-sm text-muted">{author.bio}</p>
                <p className="mt-3 text-sm tabular-nums text-cyan">{author.publishedCount} na estante</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
