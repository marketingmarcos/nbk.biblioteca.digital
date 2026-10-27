import { createFileRoute, Link } from "@tanstack/react-router";
import { FormEvent } from "react";
import { BookCard } from "@/components/book-card";
import { EmptyState } from "@/components/states";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { listCatalog, listCategories } from "@/lib/nebbook/public.functions";

type CatalogSearch = { q: string; categoria: string };

export const Route = createFileRoute("/_shell/catalogo")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    q: typeof search.q === "string" ? search.q.slice(0, 80) : "",
    categoria: typeof search.categoria === "string" ? search.categoria.slice(0, 40) : "",
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const [books, categories] = await Promise.all([
      listCatalog({ data: deps }),
      listCategories(),
    ]);
    return { books, categories, search: deps };
  },
  head: () => ({ meta: [{ title: "Catálogo · Nebbook" }] }),
  component: CatalogPage,
});

function CatalogPage() {
  const { books, categories, search } = Route.useLoaderData();
  const navigate = Route.useNavigate();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    navigate({
      search: {
        q: String(data.get("q") || ""),
        categoria: search.categoria,
      },
    });
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-4xl font-medium tracking-tight">Catálogo</h1>
      <p className="mt-2 max-w-xl text-muted">Só entram aqui obras publicadas. Rascunhos e originais em revisão ficam fora.</p>
      <p className="mt-1 text-sm tabular-nums text-subtle">{books.length} {books.length === 1 ? "obra" : "obras"}</p>
      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row" role="search">
        <label className="sr-only" htmlFor="q">Buscar</label>
        <Input id="q" name="q" defaultValue={search.q} placeholder="Título, sinopse ou autor" />
        <button className={buttonVariants()} type="submit">Buscar</button>
      </form>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        <Link
          to="/catalogo"
          search={{ q: search.q, categoria: "" }}
          className={chip(search.categoria === "")}
        >
          Tudo
        </Link>
        {categories.map((category) => (
          <Link
            key={category.slug}
            to="/catalogo"
            search={{ q: search.q, categoria: category.slug }}
            className={chip(search.categoria === category.slug)}
          >
            {category.name}
          </Link>
        ))}
      </div>
      {books.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="Nada com esse filtro" body="Tente outro termo ou volte para a estante inteira." />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </main>
  );
}

function chip(active: boolean) {
  return `inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm ${active ? "bg-violet text-white" : "border border-line text-muted"}`;
}
