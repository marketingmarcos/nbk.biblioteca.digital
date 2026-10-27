import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Route$2 } from "./router-K_C10-Xj.mjs";
import { n as useCurrentUserState } from "./use-current-user-Ix_f21xD.mjs";
import { n as buttonVariants } from "./button-CWK-dXj2.mjs";
import { i as NotFoundState, r as LoadingState } from "./states-13aFQdmT.mjs";
import { t as Badge } from "./badge-BU2yALto.mjs";
import { t as Cover } from "./cover-PwaIfe7Z.mjs";
import { t as StatusPill } from "./status-pill-B-GtU5eO.mjs";
import { l as getViewerBook } from "./account.functions-BMweADLa.mjs";
import { n as formatDate, r as shortHash, t as formatBytes } from "./format-BpaemZ-r.mjs";
import { n as saveBlob, t as fetchBookFile } from "./transfer-CfoO3VWq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/livros._slug-CB1PV4LN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BookPage() {
	const published = Route$2.useLoaderData();
	const { slug } = Route$2.useParams();
	const { user, isPending } = useCurrentUserState();
	const [privateBook, setPrivateBook] = (0, import_react.useState)(null);
	const [checked, setChecked] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (published) return;
		if (isPending) return;
		if (!user) {
			setChecked(true);
			return;
		}
		let cancel = false;
		getViewerBook({ data: slug }).then((book) => {
			if (!cancel) setPrivateBook(book);
		}).catch(() => void 0).finally(() => {
			if (!cancel) setChecked(true);
		});
		return () => {
			cancel = true;
		};
	}, [
		published,
		isPending,
		user?.id,
		slug
	]);
	if (!published && (isPending || user && !checked)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { label: "Procurando a obra…" });
	const book = published ?? privateBook;
	if (!book) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto max-w-3xl px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotFoundState, {
			title: "Obra não encontrada",
			body: "Ela pode estar em revisão, ou o endereço não existe."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cover, {
			title: book.title,
			seed: book.slug,
			category: book.categories[0]?.name,
			imageUrl: book.coverUrl
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: book.status }),
					book.isDemonstrative ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Demonstração" }) : null,
					book.language === "pt" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Português" }) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 text-4xl font-medium tracking-tight",
				children: book.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-muted",
				children: [book.authors.map((author, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [index ? ", " : "", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/autores/$slug",
					params: { slug: author.slug },
					className: "hover:text-fg",
					children: author.name
				})] }, author.slug)), book.publishedAt ? ` · ${formatDate(book.publishedAt)}` : ""]
			}),
			book.isDemonstrative ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 rounded-md border border-line bg-surface px-4 py-3 text-sm text-muted",
				children: "Obra demonstrativa. O texto foi escrito para apresentar a Nebbook e não é um envio de autor externo."
			}) : null,
			book.status !== "published" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-warn",
				children: "Esta obra ainda não está publicada. Só quem tem acesso interno consegue abri-la."
			}) : null,
			book.editorNote && book.status !== "published" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 rounded-md border border-line bg-surface px-4 py-3 text-sm",
				children: ["Nota editorial: ", book.editorNote]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 max-w-2xl text-lg leading-relaxed",
				children: book.synopsis
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/ler/$slug",
					params: { slug: book.slug },
					className: buttonVariants(),
					children: "Ler agora"
				}), book.allowDownload ? book.files.filter((file) => file.kind !== "cover").map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: buttonVariants({ variant: "secondary" }),
					onClick: () => {
						fetchBookFile(file.id, true).then((result) => saveBlob(result.buffer, result.mime, file.originalName)).catch((error) => setMessage(error instanceof Error ? error.message : "Download recusado."));
					},
					children: ["Baixar ", file.kind.toUpperCase()]
				}, file.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "self-center text-sm text-muted",
					children: "Download não autorizado para esta obra."
				})]
			}),
			message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-danger",
				children: message
			}) : null,
			book.status === "published" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/direitos",
					search: { obra: book.slug },
					className: "text-muted hover:text-fg",
					children: "Notificar um direito sobre esta obra"
				})
			}) : null,
			book.files.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 space-y-2 text-sm text-muted",
				children: book.files.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					file.kind.toUpperCase(),
					" · ",
					formatBytes(file.byteSize),
					" · SHA-256 ",
					shortHash(file.sha256)
				] }, file.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm text-muted",
				children: "Leitura em texto na plataforma. Não há arquivo anexado."
			})
		] })]
	});
}
//#endregion
export { BookPage as component };
