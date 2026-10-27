import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { EpubView } from "@/components/reader/epub-view";
import { PdfView } from "@/components/reader/pdf-view";
import { ErrorState } from "@/components/states";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getProgress, saveProgress, toggleBookmark } from "@/lib/nebbook/account.functions";
import { fetchBookFile, saveBlob } from "@/lib/nebbook/transfer";
import type { BookDetail } from "@/lib/nebbook/types";
import { cn } from "@/lib/cn";

type Mode = "text" | "pdf" | "epub";

export function ReaderScreen({ book }: { book: BookDetail }) {
  const { user, isPending } = useCurrentUserState();
  const text = book.chapters;
  const pdf = book.files.find((file) => file.kind === "pdf");
  const epub = book.files.find((file) => file.kind === "epub");
  const modes: Mode[] = [
    ...(text.length ? (["text"] as const) : []),
    ...(epub ? (["epub"] as const) : []),
    ...(pdf ? (["pdf"] as const) : []),
  ];
  const [mode, setMode] = useState<Mode>(modes[0] ?? "text");
  const [chapter, setChapter] = useState(0);
  const [size, setSize] = useState(19);
  const [paper, setPaper] = useState(false);
  const [file, setFile] = useState<ArrayBuffer | null>(null);
  const [fileError, setFileError] = useState("");
  const [note, setNote] = useState("");
  const [mark, setMark] = useState("");
  const fileId = mode === "pdf" ? pdf?.id : mode === "epub" ? epub?.id : undefined;

  useEffect(() => {
    const stored = localStorage.getItem("nebbook-reader");
    if (!stored) return;
    try {
      const pref = JSON.parse(stored) as { size?: number; paper?: boolean };
      if (pref.size) setSize(pref.size);
      if (typeof pref.paper === "boolean") setPaper(pref.paper);
    } catch {
      /* preferência local inválida */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("nebbook-reader", JSON.stringify({ size, paper }));
  }, [size, paper]);

  useEffect(() => {
    if (!user) return;
    let cancel = false;
    getProgress({ data: book.slug })
      .then((progress) => {
        if (cancel || !progress) return;
        const [kind, raw] = progress.locator.split(":");
        const value = Number(raw);
        if (kind === "c" && text.length) {
          setMode("text");
          setChapter(Math.min(value, text.length - 1));
        } else if (kind === "e" && epub) setMode("epub");
        else if (kind === "p" && pdf) setMode("pdf");
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, [user?.id, book.slug, epub, pdf, text.length]);

  useEffect(() => {
    if (!fileId) return;
    let cancel = false;
    setFile(null);
    setFileError("");
    fetchBookFile(fileId)
      .then((result) => {
        if (!cancel) setFile(result.buffer);
      })
      .catch((error: unknown) => {
        if (!cancel) setFileError(error instanceof Error ? error.message : "Falha ao abrir o arquivo.");
      });
    return () => {
      cancel = true;
    };
  }, [fileId]);

  function locator() {
    if (mode === "text") return `c:${chapter}`;
    if (mode === "epub") return `e:${chapter}`;
    return `p:${chapter || 1}`;
  }

  async function remember(nextLocator: string, pct: number) {
    if (!user) return;
    await saveProgress({ data: { slug: book.slug, locator: nextLocator, progressPct: pct } }).catch(() => undefined);
  }

  const current = text[chapter];
  const paragraphs = current?.body.split(/\n{2,}/) ?? [];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-sm text-muted">
        <Link to="/livros/$slug" params={{ slug: book.slug }} className="hover:text-fg">{book.title}</Link>
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {modes.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => { setMode(item); setChapter(0); }}
            className={cn("min-h-11 rounded-full px-4 text-sm", mode === item ? "bg-violet text-white" : "border border-line")}
          >
            {item === "text" ? "Texto" : item === "pdf" ? "PDF" : "EPUB"}
          </button>
        ))}
        <button type="button" className="min-h-11 rounded-full border border-line px-3 text-sm" onClick={() => setSize((value) => Math.max(16, value - 1))}>A−</button>
        <button type="button" className="min-h-11 rounded-full border border-line px-3 text-sm" onClick={() => setSize((value) => Math.min(24, value + 1))}>A+</button>
        <button type="button" className="min-h-11 rounded-full border border-line px-3 text-sm" onClick={() => setPaper((value) => !value)}>
          {paper ? "Céu" : "Papel"}
        </button>
        {book.allowDownload && fileId ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              void fetchBookFile(fileId, true).then((result) => saveBlob(result.buffer, result.mime, `${book.slug}.${mode === "pdf" ? "pdf" : "epub"}`));
            }}
          >
            Baixar
          </Button>
        ) : null}
      </div>
      {!isPending && !user ? (
        <p className="mt-4 text-sm text-muted">Entre na conta para guardar o ponto de leitura. O tamanho da letra fica só neste aparelho.</p>
      ) : null}
      {user ? (
        <form
          className="mt-4 flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            void toggleBookmark({ data: { slug: book.slug, locator: locator(), note } })
              .then((result) => setMark(result.saved ? "Marca salva na sua conta." : "Marca removida."))
              .catch((error: unknown) => setMark(error instanceof Error ? error.message : "Não foi possível marcar."));
          }}
        >
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Nota da marca, opcional"
            className="min-h-11 flex-1 rounded-md border border-line bg-bg px-3 text-sm"
            maxLength={240}
          />
          <Button type="submit" variant="secondary">Marcar página</Button>
        </form>
      ) : null}
      {mark ? <p className="mt-2 text-sm text-muted">{mark}</p> : null}

      {mode === "text" && text.length > 1 ? (
        <nav className="mt-6 flex gap-2 overflow-x-auto pb-1" aria-label="Capítulos">
          {text.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-current={index === chapter ? "true" : undefined}
              onClick={() => {
                setChapter(index);
                void remember(`c:${index}`, Math.round(((index + 1) / text.length) * 100));
              }}
              className={cn(
                "min-h-11 shrink-0 rounded-full px-4 text-sm",
                index === chapter ? "bg-surface-2 text-fg" : "border border-line text-muted",
              )}
            >
              {index + 1}. {item.title}
            </button>
          ))}
        </nav>
      ) : null}
      {mode === "text" && text.length ? (
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-surface" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(((chapter + 1) / text.length) * 100)} aria-label="Progresso da leitura">
          <div className="h-full bg-cyan" style={{ width: `${Math.round(((chapter + 1) / text.length) * 100)}%` }} />
        </div>
      ) : null}

      <div className={cn("mt-8 rounded-xl px-1 py-2 sm:px-6", paper ? "bg-paper text-ink" : "text-fg")} style={{ fontSize: size }}>
        {!modes.length ? <ErrorState message="Esta obra ainda não tem texto nem arquivo de leitura." /> : null}
        {mode === "text" && current ? (
          <article className="reader-body mx-auto max-w-[65ch] font-serif leading-relaxed">
            <h1 className="mb-6 font-sans text-2xl font-medium">{current.title}</h1>
            {paragraphs.map((paragraph, index) => (
              <p key={index}>
                {paragraph.split("\n").map((line, lineIndex) => (
                  <span key={lineIndex}>{lineIndex > 0 ? <br /> : null}{line}</span>
                ))}
              </p>
            ))}
            <div className="mt-10 flex items-center justify-between gap-3 font-sans text-base">
              <Button type="button" variant="secondary" disabled={chapter <= 0} onClick={() => {
                const next = chapter - 1;
                setChapter(next);
                void remember(`c:${next}`, Math.round(((next + 1) / text.length) * 100));
              }}>Anterior</Button>
              <span className="text-sm tabular-nums opacity-70">{chapter + 1} / {text.length}</span>
              <Button type="button" variant="secondary" disabled={chapter >= text.length - 1} onClick={() => {
                const next = chapter + 1;
                setChapter(next);
                void remember(`c:${next}`, Math.round(((next + 1) / text.length) * 100));
              }}>Seguinte</Button>
            </div>
          </article>
        ) : null}
        {mode !== "text" && fileError ? <ErrorState message={fileError} /> : null}
        {mode === "pdf" && file ? (
          <PdfView data={file} initialPage={1} onPage={(page, total) => { void remember(`p:${page}`, Math.round((page / total) * 100)); }} />
        ) : null}
        {mode === "epub" && file ? (
          <div className="font-serif">
            <EpubView data={file} initialIndex={0} onIndex={(index, total) => { setChapter(index); void remember(`e:${index}`, Math.round(((index + 1) / total) * 100)); }} />
          </div>
        ) : null}
        {mode !== "text" && fileId && !file && !fileError ? <p className="text-sm text-muted">Carregando arquivo…</p> : null}
      </div>
    </div>
  );
}
