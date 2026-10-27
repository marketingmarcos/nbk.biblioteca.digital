import { b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Badge } from "./badge-BU2yALto.mjs";
import { t as Cover } from "./cover-PwaIfe7Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/book-card-DwiJDe_N.js
var import_jsx_runtime = require_jsx_runtime();
function BookCard({ book }) {
	const category = book.categories[0]?.name;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/livros/$slug",
		params: { slug: book.slug },
		className: "group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cover, {
			title: book.title,
			seed: book.slug,
			category,
			imageUrl: book.coverUrl,
			className: "transition-transform duration-200 ease-out group-hover:-translate-y-0.5"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 space-y-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "line-clamp-1 text-sm text-muted",
				children: book.authors.map((author) => author.name).join(", ") || "Autor não informado"
			}), book.isDemonstrative ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Demonstração" }) : null]
		})]
	});
}
//#endregion
export { BookCard as t };
