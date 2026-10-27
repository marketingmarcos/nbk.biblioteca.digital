import { b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as Route$12 } from "./router-K_C10-Xj.mjs";
import { n as buttonVariants } from "./button-CWK-dXj2.mjs";
import { t as EmptyState } from "./states-13aFQdmT.mjs";
import { t as BookCard } from "./book-card-DwiJDe_N.mjs";
import { t as Input } from "./input-EZyWdFM6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalogo-DysT0f89.js
var import_jsx_runtime = require_jsx_runtime();
function CatalogPage() {
	const { books, categories, search } = Route$12.useLoaderData();
	const navigate = Route$12.useNavigate();
	function onSubmit(event) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		navigate({ search: {
			q: String(data.get("q") || ""),
			categoria: search.categoria
		} });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl font-medium tracking-tight",
				children: "Catálogo"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-muted",
				children: "Só entram aqui obras publicadas. Rascunhos e originais em revisão ficam fora."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm tabular-nums text-subtle",
				children: [
					books.length,
					" ",
					books.length === 1 ? "obra" : "obras"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-6 flex flex-col gap-3 sm:flex-row",
				role: "search",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "sr-only",
						htmlFor: "q",
						children: "Buscar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "q",
						name: "q",
						defaultValue: search.q,
						placeholder: "Título, sinopse ou autor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: buttonVariants(),
						type: "submit",
						children: "Buscar"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-2 overflow-x-auto pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/catalogo",
					search: {
						q: search.q,
						categoria: ""
					},
					className: chip(search.categoria === ""),
					children: "Tudo"
				}), categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/catalogo",
					search: {
						q: search.q,
						categoria: category.slug
					},
					className: chip(search.categoria === category.slug),
					children: category.name
				}, category.slug))]
			}),
			books.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Nada com esse filtro",
					body: "Tente outro termo ou volte para a estante inteira."
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
				children: books.map((book) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCard, { book }, book.id))
			})
		]
	});
}
function chip(active) {
	return `inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm ${active ? "bg-violet text-white" : "border border-line text-muted"}`;
}
//#endregion
export { CatalogPage as component };
