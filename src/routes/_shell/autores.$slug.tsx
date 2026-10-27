import { createFileRoute } from "@tanstack/react-router";
import { BookCard } from "@/components/book-card";
import { NotFoundState } from "@/components/states";
import { Badge } from "@/components/ui/badge";
import { getAuthor } from "@/lib/nebbook/public.functions";

export const Route = createFileRoute("/_shell/autores/$slug")({
  loader: ({ params }) => getAuthor({ data: params.slug }),
  head: ({ loaderData }) => ({ meta: [{ title: loaderData ? `${loaderData.name} · Nebbook` : "Autor · Nebbook" }] }),
  component: AuthorPage,
});

function AuthorPage() {
  const author = Route.useLoaderData();
  if (!author) {
    return <main className="mx-auto max-w-3xl px-4 py-16"><NotFoundState title="Autor não encontrado" body="Esse perfil não existe ou ainda não tem obra publicada." /></main>;
  }
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-4xl font-medium tracking-tight">{author.name}</h1>
        {author.isDemonstrative ? <Badge>Demonstração</Badge> : null}
      </div>
      <p className="mt-4 max-w-2xl text-muted">{author.bio}</p>
      {author.books.length === 0 ? (
        <p className="mt-8 text-sm text-muted">Nenhuma obra publicada ainda.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {author.books.map((book) => <BookCard key={book.id} book={book} />)}
        </div>
      )}
    </main>
  );
}
