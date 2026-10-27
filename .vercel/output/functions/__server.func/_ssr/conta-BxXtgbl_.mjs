import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useCurrentUserState } from "./use-current-user-Ix_f21xD.mjs";
import { t as RedirectToSignIn } from "./gates-5VoI1Z4S.mjs";
import { t as Button } from "./button-CWK-dXj2.mjs";
import { r as LoadingState } from "./states-13aFQdmT.mjs";
import { t as ROLE_LABEL } from "./editorial-vWKBtm1t.mjs";
import { t as StatusPill } from "./status-pill-B-GtU5eO.mjs";
import { n as Textarea, t as Input } from "./input-EZyWdFM6.mjs";
import { g as updateProfile, i as ensureProfile, o as getAccount } from "./account.functions-BMweADLa.mjs";
import { n as formatDate } from "./format-BpaemZ-r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/conta-BxXtgbl_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AccountPage() {
	const { user, isPending } = useCurrentUserState();
	const [account, setAccount] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [saved, setSaved] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!user) return;
		const intent = sessionStorage.getItem("nebbook-intent") === "author" ? "author" : "reader";
		sessionStorage.removeItem("nebbook-intent");
		let cancel = false;
		ensureProfile({ data: { intent } }).then(() => getAccount()).then((snapshot) => {
			if (!cancel) setAccount(snapshot);
		}).catch((reason) => {
			if (!cancel) setError(reason instanceof Error ? reason.message : "Não foi possível abrir a conta.");
		});
		return () => {
			cancel = true;
		};
	}, [user?.id]);
	if (isPending || user && !account && !error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { label: "Abrindo a sua estante…" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (!account) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto max-w-xl px-4 py-16 text-sm text-danger",
		children: error
	});
	function onSubmit(event) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		setSaved("");
		updateProfile({ data: {
			displayName: String(data.get("name") || ""),
			bio: String(data.get("bio") || "")
		} }).then(() => setSaved("Perfil atualizado.")).catch((reason) => setSaved(reason instanceof Error ? reason.message : "Não salvou."));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-3xl px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-cyan",
				children: ROLE_LABEL[account.role]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-4xl font-medium tracking-tight",
				children: account.displayName
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: account.email
			}),
			account.needsBootstrap ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 rounded-md border border-line bg-surface px-4 py-3 text-sm",
				children: [
					"Esta instalação ainda não tem administrador. ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin",
						className: "text-cyan",
						children: "Assumir a equipe"
					}),
					" é uma ação única e fica registrada."
				]
			}) : null,
			(account.role === "admin" || account.role === "editor") && !account.needsBootstrap ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin",
					className: "text-sm text-cyan",
					children: "Abrir o painel editorial"
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-8 space-y-3 rounded-xl border border-line bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Nome público", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							name: "name",
							defaultValue: account.displayName,
							className: "mt-1"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Bio", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							name: "bio",
							defaultValue: account.bio,
							className: "mt-1"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Salvar perfil"
					}),
					saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: saved
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-medium",
					children: "Continuar lendo"
				}), account.progress.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Nenhum ponto salvo ainda."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: account.progress.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/ler/$slug",
						params: { slug: item.slug },
						className: "flex min-h-11 items-center justify-between gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums text-muted",
							children: [
								item.progressPct,
								"% · ",
								formatDate(item.updatedAt)
							]
						})]
					}) }, item.slug))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-medium",
					children: "Marcas"
				}), account.bookmarks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Nenhuma marca ainda."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2 text-sm",
					children: account.bookmarks.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/ler/$slug",
						params: { slug: item.slug },
						className: "hover:underline",
						children: item.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: [
							" · ",
							item.locator,
							item.note ? ` · ${item.note}` : ""
						]
					})] }, item.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-medium",
						children: "Seus originais"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/enviar",
						className: "text-sm text-cyan",
						children: "Enviar"
					})]
				}), account.books.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Você ainda não enviou uma obra."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-3",
					children: account.books.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/livros/$slug",
							params: { slug: item.slug },
							className: "text-sm hover:underline",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: item.status })]
					}, item.slug))
				})]
			})
		]
	});
}
//#endregion
export { AccountPage as component };
