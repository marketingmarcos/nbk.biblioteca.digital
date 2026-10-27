import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LoadingState } from "@/components/states";
import { StatusPill } from "@/components/status-pill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { assignRole, claimInitialAdmin, getAdminDesk, setNoticeStatus, transitionBook } from "@/lib/nebbook/account.functions";
import { nextStatuses, ROLE_LABEL, STATUS_LABEL, transitionHint } from "@/lib/nebbook/editorial";
import { formatDate } from "@/lib/nebbook/format";
import type { AdminDesk, NoticeStatus, Role, Status } from "@/lib/nebbook/types";

export const Route = createFileRoute("/_shell/admin")({
  head: () => ({ meta: [{ title: "Equipe editorial · Nebbook" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user, isPending } = useCurrentUserState();
  const [desk, setDesk] = useState<AdminDesk | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"fila" | "avisos" | "estante" | "auditoria" | "equipe">("fila");

  function reload() {
    return getAdminDesk().then(setDesk);
  }

  useEffect(() => {
    if (!user) return;
    let cancel = false;
    reload().catch((reason: unknown) => {
      if (!cancel) setError(reason instanceof Error ? reason.message : "Painel indisponível.");
    });
    return () => { cancel = true; };
  }, [user?.id]);

  if (isPending || (user && !desk && !error)) return <LoadingState label="Abrindo o painel…" />;
  if (!user) return <RedirectToSignIn />;
  if (error) return <main className="mx-auto max-w-xl px-4 py-16 text-sm text-danger">{error}</main>;
  if (!desk) return null;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-4xl font-medium tracking-tight">Equipe editorial</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Aprovar não publica. Publicar é uma segunda ação, registrada. Ninguém aprova a própria obra.
      </p>
      {desk.state === "bootstrap" ? <Bootstrap onDone={reload} /> : null}
      {desk.state === "forbidden" ? (
        <p className="mt-8 rounded-xl border border-line bg-surface px-5 py-8 text-sm">
          Sua função é {ROLE_LABEL[desk.role]}. O painel é só de editores e administradores, e não há um atalho para se promover.
        </p>
      ) : null}
      {desk.state === "ready" ? (
        <>
          <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              ["Na fila", desk.counts.queue],
              ["Publicados", desk.counts.published],
              ["Contas", desk.counts.readers],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-xl border border-line bg-surface px-3 py-4">
                <dt className="text-xs text-muted">{label}</dt>
                <dd className="mt-1 text-2xl font-medium tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">
            {(["fila", "avisos", "estante", "auditoria", "equipe"] as const).map((item) => (
              <button key={item} type="button" onClick={() => setTab(item)} className={`min-h-11 rounded-full px-4 text-sm capitalize ${tab === item ? "bg-violet text-white" : "border border-line"}`}>
                {item === "avisos" ? `Avisos ${desk.notices.filter((notice) => notice.status === "open" || notice.status === "reviewing").length}` : item}
              </button>
            ))}
          </div>
          {tab === "fila" ? (
            <div className="mt-6 space-y-4">
              {desk.queue.length === 0 ? <p className="text-sm text-muted">A fila está vazia.</p> : desk.queue.map((book) => (
                <QueueCard key={book.id} book={book} role={desk.role} onDone={reload} />
              ))}
            </div>
          ) : null}
          {tab === "avisos" ? (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-muted">Uma notificação não publica nem arquiva. Se a equipe decidir tirar a obra do ar, isso continua sendo uma transição na fila.</p>
              {desk.notices.length === 0 ? <p className="text-sm text-muted">Nenhuma notificação de direitos.</p> : desk.notices.map((notice) => (
                <NoticeCard key={notice.id} notice={notice} onDone={reload} />
              ))}
            </div>
          ) : null}
          {tab === "estante" ? (
            <ul className="mt-6 space-y-3">
              {desk.published.map((book) => (
                <li key={book.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <Link to="/livros/$slug" params={{ slug: book.slug }} className="hover:underline">{book.title}</Link>
                  {book.isDemonstrative ? <Badge>Demonstração</Badge> : <StatusPill status={book.status} />}
                </li>
              ))}
            </ul>
          ) : null}
          {tab === "auditoria" ? (
            <ul className="mt-6 space-y-3 text-sm">
              {desk.audit.map((item) => (
                <li key={item.id} className="rounded-lg border border-line px-4 py-3">
                  <p>{item.action} · {item.entityType}</p>
                  <p className="text-muted">{item.fromStatus || "—"} → {item.toStatus || "—"} · {formatDate(item.createdAt)}</p>
                  {item.detail ? <p className="mt-1 text-muted">{item.detail}</p> : null}
                </li>
              ))}
            </ul>
          ) : null}
          {tab === "equipe" ? (
            desk.role === "admin" ? <Team team={desk.team} onDone={reload} /> : <p className="mt-6 text-sm text-muted">Só administradores alteram funções.</p>
          ) : null}
        </>
      ) : null}
    </main>
  );
}

function Bootstrap({ onDone }: { onDone: () => Promise<void> }) {
  const [error, setError] = useState("");
  return (
    <form
      className="mt-8 rounded-xl border border-line bg-surface p-5"
      onSubmit={(event) => {
        event.preventDefault();
        claimInitialAdmin()
          .then(() => onDone())
          .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Não foi possível."));
      }}
    >
      <h2 className="text-lg font-medium">Instalação sem administrador</h2>
      <p className="mt-2 text-sm text-muted">
        Enquanto não existir nenhum administrador, a primeira conta autenticada pode assumir o papel.
        A ação fica no registro e deixa de existir assim que houver um admin. Não é um modo de demonstração e não publica nada.
      </p>
      <Button type="submit" className="mt-4">Assumir a administração</Button>
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
    </form>
  );
}

function QueueCard({
  book,
  role,
  onDone,
}: {
  book: Extract<AdminDesk, { state: "ready" }>["queue"][number];
  role: Role;
  onDone: () => Promise<void>;
}) {
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const moves = nextStatuses(book.status, role, book.isOwner, book.locked);
  return (
    <article className="rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-medium">{book.title}</h2>
        <StatusPill status={book.status} />
      </div>
      {book.isDemonstrative ? <p className="mt-2 text-xs text-cyan">Peça demonstrativa da fila. A mudança de estado é real e fica registrada.</p> : null}
      {book.isOwner ? <p className="mt-2 text-sm text-warn">Você é o autor desta obra e não pode aprová-la nem publicá-la.</p> : null}
      {book.locked ? <p className="mt-2 text-sm text-muted">Obra travada. O acervo demonstrativo publicado não muda de estado.</p> : null}
      <p className="mt-3 text-sm text-muted">{book.synopsis}</p>
      <div className="mt-3 flex gap-3 text-sm">
        <Link to="/livros/$slug" params={{ slug: book.slug }} className="text-cyan">Ficha</Link>
        <Link to="/ler/$slug" params={{ slug: book.slug }} className="text-cyan">Ler</Link>
      </div>
      <Textarea value={note} onChange={(event) => setNote(event.target.value)} className="mt-4" placeholder="Nota para ajustes ou recusa" />
      <div className="mt-3 flex flex-wrap gap-2">
        {moves.map((status) => (
          <Button key={status} type="button" variant={status === "published" ? "primary" : "secondary"} onClick={() => move(book.id, status, note, onDone, setMessage)}>
            {labelFor(book.status, status)}
          </Button>
        ))}
      </div>
      {message ? <p className="mt-2 text-sm text-muted">{message}</p> : null}
    </article>
  );
}

function NoticeCard({
  notice,
  onDone,
}: {
  notice: Extract<AdminDesk, { state: "ready" }>["notices"][number];
  onDone: () => Promise<void>;
}) {
  const [note, setNote] = useState(notice.staffNote);
  const [message, setMessage] = useState("");
  const closed = notice.status === "resolved" || notice.status === "dismissed";

  function apply(status: NoticeStatus) {
    setNoticeStatus({ data: { id: notice.id, status, staffNote: note } })
      .then(() => onDone())
      .then(() => setMessage("Notificação atualizada."))
      .catch((reason: unknown) => setMessage(reason instanceof Error ? reason.message : "Não foi possível."));
  }

  return (
    <article className="rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-medium">{notice.bookTitle || notice.workReference}</h2>
        <span className="text-xs text-cyan">{NOTICE_LABEL[notice.status]}</span>
      </div>
      <p className="mt-2 text-sm text-muted">{notice.claimantName} · {notice.contactEmail} · {formatDate(notice.createdAt)}</p>
      <p className="mt-3 text-sm">{notice.statement}</p>
      <p className="mt-2 text-sm text-muted">Referência: {notice.workReference}</p>
      {notice.bookSlug ? (
        <p className="mt-2 text-sm">
          <Link to="/livros/$slug" params={{ slug: notice.bookSlug }} className="text-cyan">Abrir a ficha</Link>
        </p>
      ) : null}
      <Textarea value={note} onChange={(event) => setNote(event.target.value)} className="mt-4" placeholder="Nota da equipe" />
      {!closed ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => apply("reviewing")}>Em análise</Button>
          <Button type="button" onClick={() => apply("resolved")}>Resolver</Button>
          <Button type="button" variant="danger" onClick={() => apply("dismissed")}>Dispensar</Button>
        </div>
      ) : null}
      {message ? <p className="mt-2 text-sm text-muted">{message}</p> : null}
    </article>
  );
}

const NOTICE_LABEL: Record<NoticeStatus, string> = {
  open: "Aberta",
  reviewing: "Em análise",
  resolved: "Resolvida",
  dismissed: "Dispensada",
};

function labelFor(from: Status, to: Status) {
  if (to === "published" && from === "approved") return "Publicar";
  if (to === "approved") return "Aprovar, sem publicar";
  return STATUS_LABEL[to];
}

function move(
  bookId: string,
  to: Status,
  note: string,
  onDone: () => Promise<void>,
  setMessage: (value: string) => void,
) {
  transitionBook({ data: { bookId, to, note } })
    .then(() => onDone())
    .then(() => setMessage(transitionHint(to)))
    .catch((reason: unknown) => setMessage(reason instanceof Error ? reason.message : "Transição recusada."));
}

function Team({ team, onDone }: { team: Extract<AdminDesk, { state: "ready" }>["team"]; onDone: () => Promise<void> }) {
  const [message, setMessage] = useState("");
  return (
    <ul className="mt-6 space-y-3">
      {team.map((member) => (
        <li key={member.userId} className="flex flex-col gap-2 rounded-lg border border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm">{member.displayName}</p>
            <p className="text-xs text-muted">{member.email} · {ROLE_LABEL[member.role]}</p>
          </div>
          <select
            className="min-h-11 rounded-md border border-line bg-bg px-3 text-sm"
            defaultValue={member.role}
            onChange={(event) => {
              const role = event.target.value;
              assignRole({ data: { userId: member.userId, role } })
                .then(() => onDone())
                .then(() => setMessage("Função atualizada."))
                .catch((reason: unknown) => setMessage(reason instanceof Error ? reason.message : "Não alterou."));
            }}
          >
            {(["reader", "author", "editor", "admin"] as const).map((role) => (
              <option key={role} value={role}>{ROLE_LABEL[role]}</option>
            ))}
          </select>
        </li>
      ))}
      {message ? <li className="text-sm text-muted">{message}</li> : null}
    </ul>
  );
}
