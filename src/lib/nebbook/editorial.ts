import { ROLES, STATUSES, type Role, type Status } from "./types.ts";

export function isStatus(value: string): value is Status {
  return (STATUSES as readonly string[]).includes(value);
}

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

export const STATUS_LABEL: Record<Status, string> = {
  draft: "Rascunho",
  submitted: "Enviado",
  under_review: "Em revisão",
  changes_requested: "Ajustes pedidos",
  approved: "Aprovado",
  rejected: "Recusado",
  published: "Publicado",
  archived: "Arquivado",
};

export const ROLE_LABEL: Record<Role, string> = {
  reader: "Leitor",
  author: "Autor",
  editor: "Editor",
  admin: "Administrador",
};

const EDGES: Record<Status, readonly Status[]> = {
  draft: ["submitted"],
  submitted: ["under_review", "draft"],
  under_review: ["changes_requested", "approved", "rejected"],
  changes_requested: ["submitted"],
  approved: ["published", "archived"],
  rejected: ["draft"],
  published: ["archived"],
  archived: ["published"],
};

const AUTHOR_MOVES = new Set([
  "draft->submitted",
  "submitted->draft",
  "changes_requested->submitted",
]);

/**
 * Autores enviam e reenviam. Só editor ou administrador move a fila.
 * Quem é dono da obra não aprova nem publica a si mesmo.
 * Obra travada (acervo demonstrativo publicado) não muda de estado.
 * Aprovar não publica: approved → published é outra ação.
 */
export function canTransition(
  from: Status,
  to: Status,
  role: Role,
  isOwner: boolean,
  locked: boolean,
): boolean {
  if (locked) return false;
  if (!EDGES[from].includes(to)) return false;
  const key = `${from}->${to}`;
  if (AUTHOR_MOVES.has(key)) return isOwner && role !== "reader";
  if (role !== "editor" && role !== "admin") return false;
  if (isOwner) return false;
  return true;
}

export function nextStatuses(
  from: Status,
  role: Role,
  isOwner: boolean,
  locked: boolean,
): Status[] {
  return STATUSES.filter((to) => canTransition(from, to, role, isOwner, locked));
}

export function transitionHint(to: Status): string {
  if (to === "approved") return "Aprovar não coloca a obra na estante.";
  if (to === "published") return "Publicar torna a obra visível no catálogo.";
  if (to === "changes_requested") return "O autor poderá ajustar e reenviar.";
  if (to === "rejected") return "A obra sai da fila. Um editor pode reabri-la.";
  if (to === "archived") return "Arquivar tira a obra do catálogo público.";
  if (to === "under_review") return "Marca que alguém da equipe assumiu a leitura.";
  if (to === "submitted") return "Envia o original para a fila editorial.";
  if (to === "draft") return "Devolve a obra para rascunho.";
  return "";
}
