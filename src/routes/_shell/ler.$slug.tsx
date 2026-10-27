import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ReaderScreen } from "@/components/reader/reader-screen";
import { LoadingState, NotFoundState } from "@/components/states";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getViewerBook } from "@/lib/nebbook/account.functions";
import { getPublishedBook } from "@/lib/nebbook/public.functions";
import type { BookDetail } from "@/lib/nebbook/types";

export const Route = createFileRoute("/_shell/ler/$slug")({
  loader: ({ params }) => getPublishedBook({ data: params.slug }),
  head: ({ loaderData }) => ({ meta: [{ title: loaderData ? `Ler ${loaderData.title} · Nebbook` : "Leitura · Nebbook" }] }),
  component: ReadPage,
});

function ReadPage() {
  const published = Route.useLoaderData();
  const { slug } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const [privateBook, setPrivateBook] = useState<BookDetail | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (published) return;
    if (isPending) return;
    if (!user) {
      setChecked(true);
      return;
    }
    let cancel = false;
    getViewerBook({ data: slug })
      .then((book) => { if (!cancel) setPrivateBook(book); })
      .catch(() => undefined)
      .finally(() => { if (!cancel) setChecked(true); });
    return () => { cancel = true; };
  }, [published, isPending, user?.id, slug]);

  if (!published && (isPending || (user && !checked))) return <LoadingState label="Abrindo a leitura…" />;
  const book = published ?? privateBook;
  if (!book) {
    return <main className="mx-auto max-w-3xl px-4 py-16"><NotFoundState title="Leitura indisponível" body="A obra não está publicada ou você não tem acesso." /></main>;
  }
  return <ReaderScreen book={book} />;
}
