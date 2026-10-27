import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { StatusPill } from "@/components/status-pill";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { SignInGate } from "@/lib/auth/gates";
import { createBook, ensureProfile, listMyBooks, transitionBook, updateDraft } from "@/lib/nebbook/account.functions";
import { nextStatuses, STATUS_LABEL, transitionHint } from "@/lib/nebbook/editorial";
import { listCategories } from "@/lib/nebbook/public.functions";
import { uploadBookFile } from "@/lib/nebbook/transfer";
import type { Category, MyBook, Role } from "@/lib/nebbook/types";

export const Route = createFileRoute("/_shell/enviar")({
  loader: () => listCategories(),
  head: () => ({ meta: [{ title: "Enviar obra · Nebbook" }] }),
  component: SubmitPage,
});

function SubmitPage() {
  const categories = Route.useLoaderData();
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-4xl font-medium tracking-tight">Enviar um original</h1>
      <ol className="mt-4 space-y-2 text-sm text-muted">
        <li>1. Você cria um rascunho e confirma que tem os direitos.</li>
        <li>2. Anexa PDF, EPUB ou capa. O arquivo não vai para uma pasta pública.</li>
        <li>3. Você envia para a fila. A equipe revisa. Aprovar não publica.</li>
      </ol>
      <div className="mt-8">
        <SignInGate fallback={<p className="text-sm">Entre para enviar. <Link to="/login" className="text-cyan">Criar conta ou entrar</Link></p>}>
          <Desk categories={categories} />
        </SignInGate>
      </div>
    </main>
  );
}

function Desk({ categories }: { categories: Category[] }) {
  const [role, setRole] = useState<Role>("reader");
  const [books, setBooks] = useState<MyBook[]>([]);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function reload() {
    return listMyBooks().then((desk) => {
      setRole(desk.role);
      setBooks(desk.books);
    });
  }

  useEffect(() => {
    let cancel = false;
    ensureProfile({ data: { intent: "reader" } })
      .then(() => reload())
      .catch((reason: unknown) => { if (!cancel) setError(reason instanceof Error ? reason.message : "Falha ao carregar."); });
    return () => { cancel = true; };
  }, []);

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      if (role === "reader") await ensureProfile({ data: { intent: "author" } });
      await createBook({
        data: {
          title: String(data.get("title") || ""),
          synopsis: String(data.get("synopsis") || ""),
          categorySlug: String(data.get("category") || ""),
          allowDownload: data.get("download") === "on",
          rightsHolder: String(data.get("holder") || ""),
          rightsStatement: String(data.get("statement") || ""),
          rightsConfirmed: data.get("rights") === "on",
        },
      });
      event.currentTarget.reset();
      await reload();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível criar o rascunho.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-8">
      {role === "reader" ? (
        <p className="rounded-md border border-line bg-surface px-4 py-3 text-sm">
          Sua conta é de leitor. Ao criar o rascunho, ela passa a ser de autor. Isso não dá permissão de publicar.
        </p>
      ) : null}
      <form onSubmit={onCreate} className="space-y-3 rounded-xl border border-line bg-surface p-5">
        <label className="block text-sm">Título <Input name="title" required className="mt-1" /></label>
        <label className="block text-sm">Sinopse <Textarea name="synopsis" required minLength={40} className="mt-1" /></label>
        <label className="block text-sm">Categoria
          <select name="category" className="mt-1 min-h-11 w-full rounded-md border border-line bg-bg px-3 text-sm" required>
            {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
          </select>
        </label>
        <label className="block text-sm">Titular dos direitos <Input name="holder" required className="mt-1" /></label>
        <label className="block text-sm">Situação dos direitos
          <Textarea name="statement" required minLength={20} className="mt-1" placeholder="Descreva por que você pode oferecer esta obra." />
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" name="download" /> Pedir que o download fique disponível depois de publicada
        </label>
        <label className="flex min-h-11 items-start gap-2 text-sm">
          <input type="checkbox" name="rights" required className="mt-1" />
          Confirmo que tenho direitos para esta submissão e que a Nebbook não pode publicá-la sem revisão.
        </label>
        {error ? <p className="text-sm text-danger" role="alert">{error}</p> : null}
        <Button type="submit" disabled={pending}>{pending ? "Salvando…" : "Criar rascunho"}</Button>
      </form>
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Seus originais</h2>
        {books.length === 0 ? <p className="text-sm text-muted">Nenhum rascunho ainda.</p> : books.map((book) => (
          <BookEditor key={book.id} book={book} role={role} onChange={reload} />
        ))}
      </section>
    </div>
  );
}

function BookEditor({ book, role, onChange }: { book: MyBook; role: Role; onChange: () => Promise<void> }) {
  const [message, setMessage] = useState("");
  const editable = !book.locked && (book.status === "draft" || book.status === "changes_requested");
  const moves = nextStatuses(book.status, role, true, book.locked).filter((status) =>
    ["submitted", "draft"].includes(status),
  );

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setMessage("");
    try {
      await updateDraft({
        data: {
          bookId: book.id,
          title: String(data.get("title") || ""),
          synopsis: String(data.get("synopsis") || ""),
          allowDownload: data.get("download") === "on",
        },
      });
      setMessage("Ficha atualizada.");
      await onChange();
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Não salvou.");
    }
  }

  async function sendFile(kind: "pdf" | "epub" | "cover", file: File | undefined) {
    if (!file) return;
    setMessage("");
    try {
      await uploadBookFile(book.id, kind, file);
      setMessage("Arquivo recebido e validado.");
      await onChange();
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Envio recusado.");
    }
  }

  return (
    <article className="rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-medium">{book.title}</h3>
        <StatusPill status={book.status} />
      </div>
      {book.editorNote ? <p className="mt-2 text-sm text-muted">Nota da equipe: {book.editorNote}</p> : null}
      {editable ? (
        <form onSubmit={save} className="mt-4 space-y-3">
          <Input name="title" defaultValue={book.title} />
          <Textarea name="synopsis" defaultValue={book.synopsis} />
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" name="download" defaultChecked={book.allowDownload} /> Permitir download após a publicação
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            {(["cover", "pdf", "epub"] as const).map((kind) => (
              <label key={kind} className="text-xs text-muted">
                {kind.toUpperCase()}
                <input
                  type="file"
                  className="mt-1 block w-full text-sm"
                  accept={kind === "cover" ? "image/png,image/jpeg,image/webp" : kind === "pdf" ? "application/pdf" : ".epub,application/epub+zip"}
                  onChange={(event) => { void sendFile(kind, event.target.files?.[0]); }}
                />
              </label>
            ))}
          </div>
          <Button type="submit" variant="secondary">Salvar ficha</Button>
        </form>
      ) : <p className="mt-3 text-sm text-muted">Fora de rascunho, a ficha e os arquivos ficam congelados.</p>}
      <ul className="mt-3 text-xs text-muted">
        {book.files.map((file) => <li key={file.id}>{file.kind}: {file.originalName}</li>)}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        {moves.map((status) => (
          <Button
            key={status}
            type="button"
            variant="secondary"
            onClick={() => {
              void transitionBook({ data: { bookId: book.id, to: status, note: "" } })
                .then(() => onChange())
                .then(() => setMessage(transitionHint(status)))
                .catch((reason: unknown) => setMessage(reason instanceof Error ? reason.message : "Transição recusada."));
            }}
          >
            {STATUS_LABEL[status] === "Enviado" && book.status !== "draft" ? "Reenviar" : status === "draft" ? "Voltar a rascunho" : "Enviar para revisão"}
          </Button>
        ))}
      </div>
      {message ? <p className="mt-2 text-sm text-muted">{message}</p> : null}
    </article>
  );
}
