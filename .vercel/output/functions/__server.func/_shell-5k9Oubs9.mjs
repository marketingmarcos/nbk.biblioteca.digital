import { b as Link, w as require_jsx_runtime } from "./_libs/@tanstack/react-router+[...].mjs";
import { l as Route$15, u as brand } from "./_ssr/router-K_C10-Xj.mjs";
import { n as buttonVariants } from "./_ssr/button-CWK-dXj2.mjs";
import { t as EmptyState } from "./_ssr/states-13aFQdmT.mjs";
import { t as Badge } from "./_ssr/badge-BU2yALto.mjs";
import { t as Cover } from "./_ssr/cover-PwaIfe7Z.mjs";
import { t as BookCard } from "./_ssr/book-card-DwiJDe_N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell-5k9Oubs9.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const books = Route$15.useLoaderData();
	const featured = books[0];
	const shelf = books.slice(1, 5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rise max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-cyan",
						children: "Biblioteca gratuita"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 text-5xl font-medium tracking-tight sm:text-6xl",
						children: brand.tagline
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-lg text-muted",
						children: "A Nebbook é uma estante digital para ler sem pagar e para autores independentes enviarem originais. Nenhuma obra entra no ar sem revisão humana e uma publicação explícita."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/catalogo",
							search: {
								q: "",
								categoria: ""
							},
							className: buttonVariants(),
							children: "Explorar o catálogo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/enviar",
							className: buttonVariants({ variant: "secondary" }),
							children: "Enviar um original"
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto w-full max-w-6xl px-4 sm:px-6",
			children: featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "grid items-center gap-8 rounded-xl border border-line bg-surface p-5 sm:p-8 lg:grid-cols-[220px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cover, {
					title: featured.title,
					seed: featured.slug,
					category: featured.categories[0]?.name,
					imageUrl: featured.coverUrl,
					framed: false,
					className: "mx-auto w-full max-w-56"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-cyan",
						children: "Em órbita agora"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 text-3xl font-medium tracking-tight",
						children: featured.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: featured.authors.map((author) => author.name).join(", ") || "Autor não informado"
					}),
					featured.isDemonstrative ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: "mt-3",
						children: "Demonstração"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-xl text-base leading-relaxed",
						children: featured.synopsis
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/ler/$slug",
							params: { slug: featured.slug },
							className: buttonVariants(),
							children: "Ler agora"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/livros/$slug",
							params: { slug: featured.slug },
							className: buttonVariants({ variant: "secondary" }),
							children: "Ver a ficha"
						})]
					})
				] })]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "A estante ainda está vazia",
				body: "Quando uma obra for publicada, ela aparece aqui."
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto mt-14 w-full max-w-6xl px-4 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: [
					["Ler de graça", "PDF, EPUB ou texto na própria tela. O download só aparece quando a obra autoriza."],
					["Enviar com direitos", "O autor confirma a titularidade. O arquivo fica fora de qualquer pasta pública."],
					["Publicar é outra ação", "Aprovar não coloca o livro na estante. Só a ação Publicar faz isso."]
				].map(([title, body]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl border border-line bg-surface p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-medium",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: body
					})]
				}, title))
			})
		}),
		shelf.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto w-full max-w-6xl px-4 py-14 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-medium",
						children: "Na estante"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/catalogo",
						search: {
							q: "",
							categoria: ""
						},
						className: "text-sm text-muted hover:text-fg",
						children: "Ver tudo"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
					children: shelf.map((book) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCard, { book }, book.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 max-w-2xl text-sm text-muted",
					children: "Os títulos com a marca Demonstração foram escritos para apresentar a plataforma. Não são envios de autores externos."
				})
			]
		}) : null
	] });
}
//#endregion
export { Home as component };
