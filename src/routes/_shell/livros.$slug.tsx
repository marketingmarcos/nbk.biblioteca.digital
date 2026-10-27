import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Cover } from "@/components/cover";
import { LoadingState, NotFoundState } from "@/components/states";
import { StatusPill } from "@/components/status-pill";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getViewerBook } from "@/lib/nebbook/account.functions";
import { formatBytes, formatDate, shortHash } from "@/lib/nebbook/format";
import { getPublishedBook } from "@/lib/nebbook/public.functions";
import { fetchBookFile, saveBlob } from "@/lib/nebbook/transfer";
import type { BookDetail } from "@/lib/nebbook/types";

export const Route = createFileRoute("/_shell/livros/$slug")({
  loader: ({ params }) => getPublishedBook({ data: params.slug }),
  head: ({ loaderData }) => ({ meta: [{ title: loaderData ? `${loaderData.title} · Nebbook` : "Livro · Nebbook" }] }),
  component: BookPage,
});

function BookPage() {
  const published = Route.useLoaderData();
  const { slug } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const [privateBook, setPrivateBook] = useState<BookDetail | null>(null);
  const [checked, setChecked] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (published) return;
    if (isPending) return;
    if (!user) {
      setChecked(true);
      return;
    }
    let cancel = false;
    getViewerBook({ data: slug })
      .then((book) => {
        if (!cancel) setPrivateBook(book);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancel) setChecked(true);
      });
    return () => {
      cancel = true;
    };
  }, [published, isPending, user?.id, slug]);

  if (!published && (isPending || (user && !checked))) return <LoadingState label="Procurando a obra…" />;
  const book = published ?? privateBook;
  if (!book) return <main className="mx-auto max-w-3xl px-4 py-16"><NotFoundState title="Obra não encontrada" body="Ela pode estar em revisão, ou o endereço não existe." /></main>;

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr]">
      <Cover title={book.title} seed={book.slug} category={book.categories[0]?.name} imageUrl={book.coverUrl} />
      <div>
        <div className="flex flex-wrap gap-2">
          <StatusPill status={book.status} />
          {book.isDemonstrative ? <Badge>Demonstração</Badge> : null}
          {book.language === "pt" ? <Badge>Português</Badge> : null}
        </div>
        <h1 className="mt-4 text-4xl font-medium tracking-tight">{book.title}</h1>
        <p className="mt-2 text-muted">
          {book.authors.map((author, index) => (
            <span key={author.slug}>
              {index ? ", " : ""}
              <Link to="/autores/$slug" params={{ slug: author.slug }} className="hover:text-fg">{author.name}</Link>
            </span>
          ))}
          {book.publishedAt ? ` · ${formatDate(book.publishedAt)}` : ""}
        </p>
        {book.isDemonstrative ? (
          <p className="mt-4 rounded-md border border-line bg-surface px-4 py-3 text-sm text-muted">
            Obra demonstrativa. O texto foi escrito para apresentar a Nebbook e não é um envio de autor externo.
          </p>
        ) : null}
        {book.status !== "published" ? (
          <p className="mt-4 text-sm text-warn">Esta obra ainda não está publicada. Só quem tem acesso interno consegue abri-la.</p>
        ) : null}
        {book.editorNote && book.status !== "published" ? (
          <p className="mt-4 rounded-md border border-line bg-surface px-4 py-3 text-sm">Nota editorial: {book.editorNote}</p>
        ) : null}
        <p className="mt-6 max-w-2xl text-lg leading-relaxed">{book.synopsis}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/ler/$slug" params={{ slug: book.slug }} className={buttonVariants()}>Ler agora</Link>
          {book.allowDownload ? book.files.filter((file) => file.kind !== "cover").map((file) => (
            <button
              key={file.id}
              type="button"
              className={buttonVariants({ variant: "secondary" })}
              onClick={() => {
                void fetchBookFile(file.id, true)
                  .then((result) => saveBlob(result.buffer, result.mime, file.originalName))
                  .catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Download recusado."));
              }}
            >
              Baixar {file.kind.toUpperCase()}
            </button>
          )) : (
            <p className="self-center text-sm text-muted">Download não autorizado para esta obra.</p>
          )}
        </div>
        {message ? <p className="mt-3 text-sm text-danger">{message}</p> : null}
        {book.status === "published" ? (
          <p className="mt-6 text-sm">
            <Link to="/direitos" search={{ obra: book.slug }} className="text-muted hover:text-fg">
              Notificar um direito sobre esta obra
            </Link>
          </p>
        ) : null}
        {book.files.length ? (
          <ul className="mt-8 space-y-2 text-sm text-muted">
            {book.files.map((file) => (
              <li key={file.id}>{file.kind.toUpperCase()} · {formatBytes(file.byteSize)} · SHA-256 {shortHash(file.sha256)}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 text-sm text-muted">Leitura em texto na plataforma. Não há arquivo anexado.</p>
        )}
      </div>
    </main>
  );
}
