import { b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as buttonVariants } from "./button-CWK-dXj2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/states-13aFQdmT.js
var import_jsx_runtime = require_jsx_runtime();
function LoadingState({ label = "Carregando a estante…" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 sm:px-6",
		role: "status",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-48 animate-pulse rounded-md bg-surface" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
				children: Array.from({ length: 4 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-[2/3] animate-pulse rounded-xl bg-surface" }, index))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: label
			})
		]
	});
}
function EmptyState({ title, body, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line bg-surface px-6 py-12 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-medium",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-2 max-w-md text-sm text-muted",
				children: body
			}),
			action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: action
			}) : null
		]
	});
}
function ErrorState({ message }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-danger/40 bg-surface px-6 py-10 text-center",
		role: "alert",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-medium",
			children: "Algo saiu do eixo"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mx-auto mt-2 max-w-md break-words text-sm text-muted",
			children: message
		})]
	});
}
function NotFoundState({ title = "Não encontramos esta página", body = "O endereço pode ter mudado, ou a obra ainda não está publicada." }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title,
		body,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/catalogo",
			search: {
				q: "",
				categoria: ""
			},
			className: buttonVariants(),
			children: "Ir ao catálogo"
		})
	});
}
//#endregion
export { NotFoundState as i, ErrorState as n, LoadingState as r, EmptyState as t };
