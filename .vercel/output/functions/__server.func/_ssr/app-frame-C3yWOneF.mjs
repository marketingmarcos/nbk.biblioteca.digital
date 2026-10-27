import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link, p as useRouterState, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Menu, t as X } from "../_libs/lucide-react.mjs";
import { u as brand } from "./router-K_C10-Xj.mjs";
import { n as useCurrentUserState } from "./use-current-user-Ix_f21xD.mjs";
import { r as UserButton } from "./gates-5VoI1Z4S.mjs";
import { t as cn } from "./cn-Ccejyh36.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-frame-C3yWOneF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "mt-16 border-t border-line",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-end md:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: brand.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 max-w-sm text-sm text-muted",
				children: [brand.tagline, " Leitura gratuita, com curadoria antes da publicação."]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted",
				"aria-label": "Institucional",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/termos",
						className: "min-h-11 inline-flex items-center hover:text-fg",
						children: "Termos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/privacidade",
						className: "min-h-11 inline-flex items-center hover:text-fg",
						children: "Privacidade"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/direitos",
						search: { obra: "" },
						className: "min-h-11 inline-flex items-center hover:text-fg",
						children: "Direitos autorais"
					})
				]
			})]
		})
	});
}
var LINKS = [
	{
		to: "/catalogo",
		label: "Catálogo"
	},
	{
		to: "/autores",
		label: "Autores"
	},
	{
		to: "/enviar",
		label: "Enviar obra"
	}
];
function SiteHeader() {
	const path = useRouterState({ select: (state) => state.location.pathname });
	const { user, isPending } = useCurrentUserState();
	const [open, setOpen] = (0, import_react.useState)(false);
	const reading = path.startsWith("/ler/");
	(0, import_react.useEffect)(() => {
		setOpen(false);
	}, [path]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-30 border-b border-line bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex min-h-11 items-center gap-2 font-medium tracking-tight",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/favicon.svg",
						alt: "",
						className: "size-8"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: brand.name })]
				}),
				!reading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "ml-4 hidden items-center gap-1 md:flex",
					"aria-label": "Principal",
					children: LINKS.map((link) => {
						const active = path === link.to || path.startsWith(`${link.to}/`);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: link.to,
							search: link.to === "/catalogo" ? {
								q: "",
								categoria: ""
							} : void 0,
							className: cn("inline-flex min-h-11 items-center px-3 text-sm", active ? "text-fg" : "text-muted"),
							"aria-current": active ? "page" : void 0,
							children: link.label
						}, link.to);
					})
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-2",
					children: [
						isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-24 animate-pulse rounded-full bg-surface" }) : null,
						!isPending && user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden items-center gap-3 sm:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/conta",
								className: "text-sm text-muted hover:text-fg",
								children: "Conta"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
						}) : null,
						!isPending && !user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "hidden min-h-11 items-center px-3 text-sm sm:inline-flex",
							children: "Entrar"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "inline-flex size-11 items-center justify-center rounded-full border border-line md:hidden",
							"aria-expanded": open,
							"aria-controls": "menu-mobile",
							onClick: () => setOpen((value) => !value),
							children: [open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sr-only",
								children: "Menu"
							})]
						})
					]
				})
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			id: "menu-mobile",
			className: "border-t border-line px-4 py-2 md:hidden",
			"aria-label": "Mobile",
			children: [
				LINKS.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: link.to,
					search: link.to === "/catalogo" ? {
						q: "",
						categoria: ""
					} : void 0,
					className: "flex min-h-11 items-center text-sm",
					children: link.label
				}, link.to)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/conta",
					className: "flex min-h-11 items-center text-sm",
					children: "Conta"
				}),
				!user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					className: "flex min-h-11 items-center text-sm",
					children: "Entrar"
				}) : null
			]
		}) : null]
	});
}
function AppFrame({ children }) {
	const reading = useRouterState({ select: (state) => state.location.pathname }).startsWith("/ler/");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-screen flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "starfield",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#conteudo",
				className: "sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-surface focus:px-3 focus:py-2",
				children: "Ir ao conteúdo"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				id: "conteudo",
				className: "relative z-10 flex-1",
				children
			}),
			reading ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { AppFrame as t };
