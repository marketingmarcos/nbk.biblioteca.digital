import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Route$9 } from "./router-K_C10-Xj.mjs";
import { n as SignInGate } from "./gates-5VoI1Z4S.mjs";
import { t as Button } from "./button-CWK-dXj2.mjs";
import { n as STATUS_LABEL, o as nextStatuses, s as transitionHint } from "./editorial-vWKBtm1t.mjs";
import { t as StatusPill } from "./status-pill-B-GtU5eO.mjs";
import { n as Textarea, t as Input } from "./input-EZyWdFM6.mjs";
import { h as updateDraft, i as ensureProfile, m as transitionBook, r as createBook, u as listMyBooks } from "./account.functions-BMweADLa.mjs";
import { r as uploadBookFile } from "./transfer-CfoO3VWq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/enviar-B2M-3VtY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SubmitPage() {
	const categories = Route$9.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-3xl px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl font-medium tracking-tight",
				children: "Enviar um original"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "mt-4 space-y-2 text-sm text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "1. Você cria um rascunho e confirma que tem os direitos." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "2. Anexa PDF, EPUB ou capa. O arquivo não vai para uma pasta pública." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "3. Você envia para a fila. A equipe revisa. Aprovar não publica." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInGate, {
					fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: ["Entre para enviar. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "text-cyan",
							children: "Criar conta ou entrar"
						})]
					}),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Desk, { categories })
				})
			})
		]
	});
}
function Desk({ categories }) {
	const [role, setRole] = (0, import_react.useState)("reader");
	const [books, setBooks] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	function reload() {
		return listMyBooks().then((desk) => {
			setRole(desk.role);
			setBooks(desk.books);
		});
	}
	(0, import_react.useEffect)(() => {
		let cancel = false;
		ensureProfile({ data: { intent: "reader" } }).then(() => reload()).catch((reason) => {
			if (!cancel) setError(reason instanceof Error ? reason.message : "Falha ao carregar.");
		});
		return () => {
			cancel = true;
		};
	}, []);
	async function onCreate(event) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		setPending(true);
		setError("");
		try {
			if (role === "reader") await ensureProfile({ data: { intent: "author" } });
			await createBook({ data: {
				title: String(data.get("title") || ""),
				synopsis: String(data.get("synopsis") || ""),
				categorySlug: String(data.get("category") || ""),
				allowDownload: data.get("download") === "on",
				rightsHolder: String(data.get("holder") || ""),
				rightsStatement: String(data.get("statement") || ""),
				rightsConfirmed: data.get("rights") === "on"
			} });
			event.currentTarget.reset();
			await reload();
		} catch (reason) {
			setError(reason instanceof Error ? reason.message : "Não foi possível criar o rascunho.");
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			role === "reader" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-md border border-line bg-surface px-4 py-3 text-sm",
				children: "Sua conta é de leitor. Ao criar o rascunho, ela passa a ser de autor. Isso não dá permissão de publicar."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: onCreate,
				className: "space-y-3 rounded-xl border border-line bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Título ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							name: "title",
							required: true,
							className: "mt-1"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Sinopse ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							name: "synopsis",
							required: true,
							minLength: 40,
							className: "mt-1"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Categoria", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							name: "category",
							className: "mt-1 min-h-11 w-full rounded-md border border-line bg-bg px-3 text-sm",
							required: true,
							children: categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: category.slug,
								children: category.name
							}, category.slug))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Titular dos direitos ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							name: "holder",
							required: true,
							className: "mt-1"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Situação dos direitos", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							name: "statement",
							required: true,
							minLength: 20,
							className: "mt-1",
							placeholder: "Descreva por que você pode oferecer esta obra."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-11 items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							name: "download"
						}), " Pedir que o download fique disponível depois de publicada"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-11 items-start gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							name: "rights",
							required: true,
							className: "mt-1"
						}), "Confirmo que tenho direitos para esta submissão e que a Nebbook não pode publicá-la sem revisão."]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						role: "alert",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: pending,
						children: pending ? "Salvando…" : "Criar rascunho"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-medium",
					children: "Seus originais"
				}), books.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Nenhum rascunho ainda."
				}) : books.map((book) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookEditor, {
					book,
					role,
					onChange: reload
				}, book.id))]
			})
		]
	});
}
function BookEditor({ book, role, onChange }) {
	const [message, setMessage] = (0, import_react.useState)("");
	const editable = !book.locked && (book.status === "draft" || book.status === "changes_requested");
	const moves = nextStatuses(book.status, role, true, book.locked).filter((status) => ["submitted", "draft"].includes(status));
	async function save(event) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		setMessage("");
		try {
			await updateDraft({ data: {
				bookId: book.id,
				title: String(data.get("title") || ""),
				synopsis: String(data.get("synopsis") || ""),
				allowDownload: data.get("download") === "on"
			} });
			setMessage("Ficha atualizada.");
			await onChange();
		} catch (reason) {
			setMessage(reason instanceof Error ? reason.message : "Não salvou.");
		}
	}
	async function sendFile(kind, file) {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl border border-line bg-surface p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-medium",
					children: book.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: book.status })]
			}),
			book.editorNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted",
				children: ["Nota da equipe: ", book.editorNote]
			}) : null,
			editable ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: save,
				className: "mt-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "title",
						defaultValue: book.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						name: "synopsis",
						defaultValue: book.synopsis
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-11 items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							name: "download",
							defaultChecked: book.allowDownload
						}), " Permitir download após a publicação"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 sm:grid-cols-3",
						children: [
							"cover",
							"pdf",
							"epub"
						].map((kind) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs text-muted",
							children: [kind.toUpperCase(), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								className: "mt-1 block w-full text-sm",
								accept: kind === "cover" ? "image/png,image/jpeg,image/webp" : kind === "pdf" ? "application/pdf" : ".epub,application/epub+zip",
								onChange: (event) => {
									sendFile(kind, event.target.files?.[0]);
								}
							})]
						}, kind))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						variant: "secondary",
						children: "Salvar ficha"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Fora de rascunho, a ficha e os arquivos ficam congelados."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 text-xs text-muted",
				children: book.files.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					file.kind,
					": ",
					file.originalName
				] }, file.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: moves.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "secondary",
					onClick: () => {
						transitionBook({ data: {
							bookId: book.id,
							to: status,
							note: ""
						} }).then(() => onChange()).then(() => setMessage(transitionHint(status))).catch((reason) => setMessage(reason instanceof Error ? reason.message : "Transição recusada."));
					},
					children: STATUS_LABEL[status] === "Enviado" && book.status !== "draft" ? "Reenviar" : status === "draft" ? "Voltar a rascunho" : "Enviar para revisão"
				}, status))
			}),
			message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: message
			}) : null
		]
	});
}
//#endregion
export { SubmitPage as component };
