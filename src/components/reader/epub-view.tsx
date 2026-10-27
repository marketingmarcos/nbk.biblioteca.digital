import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/states";
import { openEpub, type OpenEpub } from "@/lib/nebbook/epub";

export function EpubView({
  data,
  initialIndex,
  onIndex,
}: {
  data: ArrayBuffer;
  initialIndex: number;
  onIndex: (index: number, total: number) => void;
}) {
  const [book, setBook] = useState<OpenEpub | null>(null);
  const [index, setIndex] = useState(Math.max(0, initialIndex));
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");
  const urls = useRef<string[]>([]);
  const onIndexRef = useRef(onIndex);
  onIndexRef.current = onIndex;

  useEffect(() => {
    try {
      const opened = openEpub(data.slice(0));
      setBook(opened);
      setIndex((current) => Math.min(current, Math.max(0, opened.titles.length - 1)));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível abrir o EPUB.");
    }
  }, [data]);

  useEffect(() => {
    if (!book) return;
    urls.current.forEach((url) => URL.revokeObjectURL(url));
    const rendered = book.render(index);
    urls.current = rendered.urls;
    setHtml(rendered.html);
    return () => {
      urls.current.forEach((url) => URL.revokeObjectURL(url));
      urls.current = [];
    };
  }, [book, index]);

  if (error) return <ErrorState message={error} />;
  if (!book) return <p className="text-sm text-muted">Abrindo EPUB…</p>;

  return (
    <div className="space-y-4">
      <article className="reader-body max-w-[65ch] text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="secondary" disabled={index <= 0} onClick={() => setIndex((value) => { const next = value - 1; onIndexRef.current(next, book.titles.length); return next; })}>
          Anterior
        </Button>
        <p className="text-sm tabular-nums text-muted">{index + 1} / {book.titles.length}</p>
        <Button type="button" variant="secondary" disabled={index >= book.titles.length - 1} onClick={() => setIndex((value) => { const next = value + 1; onIndexRef.current(next, book.titles.length); return next; })}>
          Seguinte
        </Button>
      </div>
    </div>
  );
}
