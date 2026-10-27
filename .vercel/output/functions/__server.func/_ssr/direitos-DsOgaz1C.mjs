import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Route$10 } from "./router-K_C10-Xj.mjs";
import { n as useCurrentUserState } from "./use-current-user-Ix_f21xD.mjs";
import { t as Button } from "./button-CWK-dXj2.mjs";
import { n as Textarea, t as Input } from "./input-EZyWdFM6.mjs";
import { a as fileNotice } from "./account.functions-BMweADLa.mjs";
import { t as Legal } from "./legal-Cg-yE3ho.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/direitos-DsOgaz1C.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RightsPage() {
	const { books, obra } = Route$10.useLoaderData();
	const selected = books.some((book) => book.slug === obra) ? obra : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Legal, {
		title: "Direitos autorais",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "O autor permanece titular da obra. Enviar um original não transfere a propriedade para a Nebbook." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Ao submeter, o autor confirma que pode oferecer o texto e concede uma licença não exclusiva para a equipe avaliar o arquivo e, somente se a obra for publicada, exibi-la na estante e permitir a leitura. O download só existe se essa opção estiver marcada e a obra estiver publicada." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Aprovar não liga essa licença de exibição pública. A publicação é uma decisão separada, feita por editor ou administrador que não seja o autor da obra." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Arquivar tira a obra do catálogo. Isso não apaga, por si, o registro de direitos." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Os textos marcados como demonstração foram escritos para esta plataforma. Não representam cessão de um autor externo." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Se uma obra publicada ferir direitos de terceiros, use o formulário abaixo. A notificação entra na fila da equipe. Ela não tira o livro do ar sozinha: arquivar continua sendo uma decisão editorial registrada." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoticeForm, {
				books,
				initialSlug: selected
			})
		]
	});
}
function NoticeForm({ books, initialSlug }) {
	const { user, isPending } = useCurrentUserState();
	const [message, setMessage] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	function onSubmit(event) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		setMessage("");
		setError("");
		setPending(true);
		fileNotice({ data: {
			bookSlug: String(data.get("obra") || ""),
			claimantName: String(data.get("nome") || ""),
			workReference: String(data.get("referencia") || ""),
			statement: String(data.get("relato") || "")
		} }).then(() => {
			setMessage("Notificação registrada. A equipe vê o relato no painel, com o e-mail da sua conta.");
			event.currentTarget.reset();
		}).catch((reason) => setError(reason instanceof Error ? reason.message : "Não foi possível registrar.")).finally(() => setPending(false));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-8 rounded-xl border border-line bg-surface p-5 text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-sans text-lg font-medium text-fg",
				children: "Notificar uma obra"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm",
				children: "Conta obrigatória. O contato usado é o e-mail com que você entrou. Não envie senha nem documento aqui."
			}),
			isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm",
				children: "Verificando a sessão…"
			}) : null,
			!isPending && !user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					className: "text-cyan",
					children: "Entre na conta"
				}), " para enviar a notificação."]
			}) : null,
			user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm text-fg",
						children: ["Obra na estante", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							name: "obra",
							defaultValue: initialSlug,
							className: "mt-1 min-h-11 w-full rounded-md border border-line bg-bg px-3 text-sm text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Não está listada, ou não sei o endereço"
							}), books.map((book) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: book.slug,
								children: book.title
							}, book.slug))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm text-fg",
						children: ["Quem reclama a titularidade", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							name: "nome",
							className: "mt-1",
							required: true,
							minLength: 2,
							maxLength: 80,
							autoComplete: "name"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm text-fg",
						children: ["Obra original", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							name: "referencia",
							className: "mt-1",
							required: true,
							minLength: 4,
							maxLength: 160,
							placeholder: "Título, autor e onde a obra original pode ser conferida"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm text-fg",
						children: ["Relato", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							name: "relato",
							className: "mt-1",
							required: true,
							minLength: 40,
							maxLength: 2e3,
							placeholder: "O que foi usado sem autorização, e o que você pede que a equipe faça."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: pending,
						children: pending ? "Enviando…" : "Registrar notificação"
					}),
					message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-ok",
						children: message
					}) : null,
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: error
					}) : null
				]
			}) : null
		]
	});
}
//#endregion
export { RightsPage as component };
