import { createFileRoute, Link } from "@tanstack/react-router";
import { BookCard } from "@/components/book-card";
import { Cover } from "@/components/cover";
import { EmptyState } from "@/components/states";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { brand } from "@/lib/nebbook/brand";
import { listCatalog } from "@/lib/nebbook/public.functions";

export const Route = createFileRoute("/_shell/")({
  loader: () => listCatalog({ data: { q: "", categoria: "" } }),
  component: Home,
});

function Home() {
  const books = Route.useLoaderData();
  const featured = books[0];
  const shelf = books.slice(1, 5);

  return (
    <main>
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="rise max-w-2xl">
          <p className="text-sm text-cyan">Biblioteca gratuita</p>
          <h1 className="mt-3 text-5xl font-medium tracking-tight sm:text-6xl">{brand.tagline}</h1>
          <p className="mt-5 text-lg text-muted">
            A Nebbook é uma estante digital para ler sem pagar e para autores independentes enviarem originais.
            Nenhuma obra entra no ar sem revisão humana e uma publicação explícita.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/catalogo" search={{ q: "", categoria: "" }} className={buttonVariants()}>
              Explorar o catálogo
            </Link>
            <Link to="/enviar" className={buttonVariants({ variant: "secondary" })}>
              Enviar um original
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {featured ? (
          <article className="grid items-center gap-8 rounded-xl border border-line bg-surface p-5 sm:p-8 lg:grid-cols-[220px_1fr]">
            <Cover
              title={featured.title}
              seed={featured.slug}
              category={featured.categories[0]?.name}
              imageUrl={featured.coverUrl}
              framed={false}
              className="mx-auto w-full max-w-56"
            />
            <div>
              <p className="text-sm text-cyan">Em órbita agora</p>
              <h2 className="mt-2 text-3xl font-medium tracking-tight">{featured.title}</h2>
              <p className="mt-2 text-sm text-muted">
                {featured.authors.map((author) => author.name).join(", ") || "Autor não informado"}
              </p>
              {featured.isDemonstrative ? <Badge className="mt-3">Demonstração</Badge> : null}
              <p className="mt-4 max-w-xl text-base leading-relaxed">{featured.synopsis}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/ler/$slug" params={{ slug: featured.slug }} className={buttonVariants()}>Ler agora</Link>
                <Link to="/livros/$slug" params={{ slug: featured.slug }} className={buttonVariants({ variant: "secondary" })}>
                  Ver a ficha
                </Link>
              </div>
            </div>
          </article>
        ) : (
          <EmptyState title="A estante ainda está vazia" body="Quando uma obra for publicada, ela aparece aqui." />
        )}
      </section>

      <section className="mx-auto mt-14 w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Ler de graça", "PDF, EPUB ou texto na própria tela. O download só aparece quando a obra autoriza."],
            ["Enviar com direitos", "O autor confirma a titularidade. O arquivo fica fora de qualquer pasta pública."],
            ["Publicar é outra ação", "Aprovar não coloca o livro na estante. Só a ação Publicar faz isso."],
          ].map(([title, body]) => (
            <article key={title} className="rounded-xl border border-line bg-surface p-5">
              <h2 className="text-lg font-medium">{title}</h2>
              <p className="mt-2 text-sm text-muted">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {shelf.length ? (
        <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-medium">Na estante</h2>
            <Link to="/catalogo" search={{ q: "", categoria: "" }} className="text-sm text-muted hover:text-fg">Ver tudo</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {shelf.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-sm text-muted">
            Os títulos com a marca Demonstração foram escritos para apresentar a plataforma. Não são envios de autores externos.
          </p>
        </section>
      ) : null}
    </main>
  );
}
