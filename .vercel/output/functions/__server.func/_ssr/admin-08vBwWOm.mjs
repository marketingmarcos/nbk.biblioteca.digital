import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useCurrentUserState } from "./use-current-user-Ix_f21xD.mjs";
import { t as RedirectToSignIn } from "./gates-5VoI1Z4S.mjs";
import { t as Button } from "./button-CWK-dXj2.mjs";
import { r as LoadingState } from "./states-13aFQdmT.mjs";
import { t as Badge } from "./badge-BU2yALto.mjs";
import { n as STATUS_LABEL, o as nextStatuses, s as transitionHint, t as ROLE_LABEL } from "./editorial-vWKBtm1t.mjs";
import { t as StatusPill } from "./status-pill-B-GtU5eO.mjs";
import { n as Textarea } from "./input-EZyWdFM6.mjs";
import { f as setNoticeStatus, m as transitionBook, n as claimInitialAdmin, s as getAdminDesk, t as assignRole } from "./account.functions-BMweADLa.mjs";
import { n as formatDate } from "./format-BpaemZ-r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-08vBwWOm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const { user, isPending } = useCurrentUserState();
	const [desk, setDesk] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [tab, setTab] = (0, import_react.useState)("fila");
	function reload() {
		return getAdminDesk().then(setDesk);
	}
	(0, import_react.useEffect)(() => {
		if (!user) return;
		let cancel = false;
		reload().catch((reason) => {
			if (!cancel) setError(reason instanceof Error ? reason.message : "Painel indisponível.");
		});
		return () => {
			cancel = true;
		};
	}, [user?.id]);
	if (isPending || user && !desk && !error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { label: "Abrindo o painel…" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto max-w-xl px-4 py-16 text-sm text-danger",
		children: error
	});
	if (!desk) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-5xl px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl font-medium tracking-tight",
				children: "Equipe editorial"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm text-muted",
				children: "Aprovar não publica. Publicar é uma segunda ação, registrada. Ninguém aprova a própria obra."
			}),
			desk.state === "bootstrap" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bootstrap, { onDone: reload }) : null,
			desk.state === "forbidden" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-8 rounded-xl border border-line bg-surface px-5 py-8 text-sm",
				children: [
					"Sua função é ",
					ROLE_LABEL[desk.role],
					". O painel é só de editores e administradores, e não há um atalho para se promover."
				]
			}) : null,
			desk.state === "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-6 grid grid-cols-3 gap-3 text-center",
					children: [
						["Na fila", desk.counts.queue],
						["Publicados", desk.counts.published],
						["Contas", desk.counts.readers]
					].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-line bg-surface px-3 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted",
							children: label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 text-2xl font-medium tabular-nums",
							children: value
						})]
					}, String(label)))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex flex-wrap gap-2",
					children: [
						"fila",
						"avisos",
						"estante",
						"auditoria",
						"equipe"
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab(item),
						className: `min-h-11 rounded-full px-4 text-sm capitalize ${tab === item ? "bg-violet text-white" : "border border-line"}`,
						children: item === "avisos" ? `Avisos ${desk.notices.filter((notice) => notice.status === "open" || notice.status === "reviewing").length}` : item
					}, item))
				}),
				tab === "fila" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 space-y-4",
					children: desk.queue.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "A fila está vazia."
					}) : desk.queue.map((book) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueueCard, {
						book,
						role: desk.role,
						onDone: reload
					}, book.id))
				}) : null,
				tab === "avisos" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Uma notificação não publica nem arquiva. Se a equipe decidir tirar a obra do ar, isso continua sendo uma transição na fila."
					}), desk.notices.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Nenhuma notificação de direitos."
					}) : desk.notices.map((notice) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoticeCard, {
						notice,
						onDone: reload
					}, notice.id))]
				}) : null,
				tab === "estante" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 space-y-3",
					children: desk.published.map((book) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/livros/$slug",
							params: { slug: book.slug },
							className: "hover:underline",
							children: book.title
						}), book.isDemonstrative ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Demonstração" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: book.status })]
					}, book.id))
				}) : null,
				tab === "auditoria" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 space-y-3 text-sm",
					children: desk.audit.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg border border-line px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								item.action,
								" · ",
								item.entityType
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted",
								children: [
									item.fromStatus || "—",
									" → ",
									item.toStatus || "—",
									" · ",
									formatDate(item.createdAt)
								]
							}),
							item.detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-muted",
								children: item.detail
							}) : null
						]
					}, item.id))
				}) : null,
				tab === "equipe" ? desk.role === "admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Team, {
					team: desk.team,
					onDone: reload
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm text-muted",
					children: "Só administradores alteram funções."
				}) : null
			] }) : null
		]
	});
}
function Bootstrap({ onDone }) {
	const [error, setError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mt-8 rounded-xl border border-line bg-surface p-5",
		onSubmit: (event) => {
			event.preventDefault();
			claimInitialAdmin().then(() => onDone()).catch((reason) => setError(reason instanceof Error ? reason.message : "Não foi possível."));
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-medium",
				children: "Instalação sem administrador"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Enquanto não existir nenhum administrador, a primeira conta autenticada pode assumir o papel. A ação fica no registro e deixa de existir assim que houver um admin. Não é um modo de demonstração e não publica nada."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "mt-4",
				children: "Assumir a administração"
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-danger",
				children: error
			}) : null
		]
	});
}
function QueueCard({ book, role, onDone }) {
	const [note, setNote] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const moves = nextStatuses(book.status, role, book.isOwner, book.locked);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl border border-line bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-medium",
					children: book.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: book.status })]
			}),
			book.isDemonstrative ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-cyan",
				children: "Peça demonstrativa da fila. A mudança de estado é real e fica registrada."
			}) : null,
			book.isOwner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-warn",
				children: "Você é o autor desta obra e não pode aprová-la nem publicá-la."
			}) : null,
			book.locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Obra travada. O acervo demonstrativo publicado não muda de estado."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: book.synopsis
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex gap-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/livros/$slug",
					params: { slug: book.slug },
					className: "text-cyan",
					children: "Ficha"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/ler/$slug",
					params: { slug: book.slug },
					className: "text-cyan",
					children: "Ler"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value: note,
				onChange: (event) => setNote(event.target.value),
				className: "mt-4",
				placeholder: "Nota para ajustes ou recusa"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: moves.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: status === "published" ? "primary" : "secondary",
					onClick: () => move(book.id, status, note, onDone, setMessage),
					children: labelFor(book.status, status)
				}, status))
			}),
			message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: message
			}) : null
		]
	});
}
function NoticeCard({ notice, onDone }) {
	const [note, setNote] = (0, import_react.useState)(notice.staffNote);
	const [message, setMessage] = (0, import_react.useState)("");
	const closed = notice.status === "resolved" || notice.status === "dismissed";
	function apply(status) {
		setNoticeStatus({ data: {
			id: notice.id,
			status,
			staffNote: note
		} }).then(() => onDone()).then(() => setMessage("Notificação atualizada.")).catch((reason) => setMessage(reason instanceof Error ? reason.message : "Não foi possível."));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl border border-line bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-medium",
					children: notice.bookTitle || notice.workReference
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-cyan",
					children: NOTICE_LABEL[notice.status]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: [
					notice.claimantName,
					" · ",
					notice.contactEmail,
					" · ",
					formatDate(notice.createdAt)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm",
				children: notice.statement
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: ["Referência: ", notice.workReference]
			}),
			notice.bookSlug ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/livros/$slug",
					params: { slug: notice.bookSlug },
					className: "text-cyan",
					children: "Abrir a ficha"
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value: note,
				onChange: (event) => setNote(event.target.value),
				className: "mt-4",
				placeholder: "Nota da equipe"
			}),
			!closed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "secondary",
						onClick: () => apply("reviewing"),
						children: "Em análise"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						onClick: () => apply("resolved"),
						children: "Resolver"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "danger",
						onClick: () => apply("dismissed"),
						children: "Dispensar"
					})
				]
			}) : null,
			message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: message
			}) : null
		]
	});
}
var NOTICE_LABEL = {
	open: "Aberta",
	reviewing: "Em análise",
	resolved: "Resolvida",
	dismissed: "Dispensada"
};
function labelFor(from, to) {
	if (to === "published" && from === "approved") return "Publicar";
	if (to === "approved") return "Aprovar, sem publicar";
	return STATUS_LABEL[to];
}
function move(bookId, to, note, onDone, setMessage) {
	transitionBook({ data: {
		bookId,
		to,
		note
	} }).then(() => onDone()).then(() => setMessage(transitionHint(to))).catch((reason) => setMessage(reason instanceof Error ? reason.message : "Transição recusada."));
}
function Team({ team, onDone }) {
	const [message, setMessage] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: "mt-6 space-y-3",
		children: [team.map((member) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex flex-col gap-2 rounded-lg border border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: member.displayName
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: [
					member.email,
					" · ",
					ROLE_LABEL[member.role]
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				className: "min-h-11 rounded-md border border-line bg-bg px-3 text-sm",
				defaultValue: member.role,
				onChange: (event) => {
					const role = event.target.value;
					assignRole({ data: {
						userId: member.userId,
						role
					} }).then(() => onDone()).then(() => setMessage("Função atualizada.")).catch((reason) => setMessage(reason instanceof Error ? reason.message : "Não alterou."));
				},
				children: [
					"reader",
					"author",
					"editor",
					"admin"
				].map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: role,
					children: ROLE_LABEL[role]
				}, role))
			})]
		}, member.userId)), message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
			className: "text-sm text-muted",
			children: message
		}) : null]
	});
}
//#endregion
export { AdminPage as component };
