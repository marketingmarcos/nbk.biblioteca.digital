import { w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Route$4 } from "./router-K_C10-Xj.mjs";
import { i as NotFoundState } from "./states-13aFQdmT.mjs";
import { t as Badge } from "./badge-BU2yALto.mjs";
import { t as BookCard } from "./book-card-DwiJDe_N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/autores._slug-CouR2gVy.js
var import_jsx_runtime = require_jsx_runtime();
function AuthorPage() {
	const author = Route$4.useLoaderData();
	if (!author) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto max-w-3xl px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotFoundState, {
			title: "Autor não encontrado",
			body: "Esse perfil não existe ou ainda não tem obra publicada."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-4xl font-medium tracking-tight",
					children: author.name
				}), author.isDemonstrative ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Demonstração" }) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-2xl text-muted",
				children: author.bio
			}),
			author.books.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm text-muted",
				children: "Nenhuma obra publicada ainda."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
				children: author.books.map((book) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCard, { book }, book.id))
			})
		]
	});
}
//#endregion
export { AuthorPage as component };
