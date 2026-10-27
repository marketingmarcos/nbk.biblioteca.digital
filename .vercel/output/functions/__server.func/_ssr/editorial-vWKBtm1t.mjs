//#region node_modules/.nitro/vite/services/ssr/assets/editorial-vWKBtm1t.js
var STATUSES = [
	"draft",
	"submitted",
	"under_review",
	"changes_requested",
	"approved",
	"rejected",
	"published",
	"archived"
];
var ROLES = [
	"reader",
	"author",
	"editor",
	"admin"
];
function isStatus(value) {
	return STATUSES.includes(value);
}
function isRole(value) {
	return ROLES.includes(value);
}
var STATUS_LABEL = {
	draft: "Rascunho",
	submitted: "Enviado",
	under_review: "Em revisão",
	changes_requested: "Ajustes pedidos",
	approved: "Aprovado",
	rejected: "Recusado",
	published: "Publicado",
	archived: "Arquivado"
};
var ROLE_LABEL = {
	reader: "Leitor",
	author: "Autor",
	editor: "Editor",
	admin: "Administrador"
};
var EDGES = {
	draft: ["submitted"],
	submitted: ["under_review", "draft"],
	under_review: [
		"changes_requested",
		"approved",
		"rejected"
	],
	changes_requested: ["submitted"],
	approved: ["published", "archived"],
	rejected: ["draft"],
	published: ["archived"],
	archived: ["published"]
};
var AUTHOR_MOVES = /* @__PURE__ */ new Set([
	"draft->submitted",
	"submitted->draft",
	"changes_requested->submitted"
]);
/**
* Autores enviam e reenviam. Só editor ou administrador move a fila.
* Quem é dono da obra não aprova nem publica a si mesmo.
* Obra travada (acervo demonstrativo publicado) não muda de estado.
* Aprovar não publica: approved → published é outra ação.
*/
function canTransition(from, to, role, isOwner, locked) {
	if (locked) return false;
	if (!EDGES[from].includes(to)) return false;
	const key = `${from}->${to}`;
	if (AUTHOR_MOVES.has(key)) return isOwner && role !== "reader";
	if (role !== "editor" && role !== "admin") return false;
	if (isOwner) return false;
	return true;
}
function nextStatuses(from, role, isOwner, locked) {
	return STATUSES.filter((to) => canTransition(from, to, role, isOwner, locked));
}
function transitionHint(to) {
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
//#endregion
export { isStatus as a, isRole as i, STATUS_LABEL as n, nextStatuses as o, canTransition as r, transitionHint as s, ROLE_LABEL as t };
