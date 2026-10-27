import { b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Route$13 } from "./router-K_C10-Xj.mjs";
import { t as EmptyState } from "./states-13aFQdmT.mjs";
import { t as Badge } from "./badge-BU2yALto.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/autores-DyLaHGCr.js
var import_jsx_runtime = require_jsx_runtime();
function AuthorsPage() {
	const authors = Route$13.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl font-medium tracking-tight",
				children: "Autores"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-muted",
				children: "Quem tem pelo menos uma obra publicada. Perfis fictícios do acervo demonstrativo estão marcados."
			}),
			authors.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Nenhum autor publicado",
					body: "Quando uma obra for publicada, a pessoa autora aparece aqui."
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 grid gap-4 md:grid-cols-2",
				children: authors.map((author) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/autores/$slug",
					params: { slug: author.slug },
					className: "block rounded-xl border border-line bg-surface p-5 hover:bg-surface-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-medium",
								children: author.name
							}), author.isDemonstrative ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Demonstração" }) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: author.bio
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm tabular-nums text-cyan",
							children: [author.publishedCount, " na estante"]
						})
					]
				}) }, author.slug))
			})
		]
	});
}
//#endregion
export { AuthorsPage as component };
