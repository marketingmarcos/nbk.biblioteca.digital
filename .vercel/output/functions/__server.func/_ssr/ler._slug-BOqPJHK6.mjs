import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as Link, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Route$3 } from "./router-K_C10-Xj.mjs";
import { n as useCurrentUserState } from "./use-current-user-Ix_f21xD.mjs";
import { t as cn } from "./cn-Ccejyh36.mjs";
import { t as Button } from "./button-CWK-dXj2.mjs";
import { i as NotFoundState, n as ErrorState, r as LoadingState } from "./states-13aFQdmT.mjs";
import { c as getProgress, d as saveProgress, l as getViewerBook, p as toggleBookmark } from "./account.functions-BMweADLa.mjs";
import { n as saveBlob, t as fetchBookFile } from "./transfer-CfoO3VWq.mjs";
import { n as unzipSync } from "../_libs/fflate.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ler._slug-BOqPJHK6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DROP = /* @__PURE__ */ new Set([
	"script",
	"style",
	"iframe",
	"object",
	"embed",
	"link",
	"meta",
	"base",
	"form",
	"svg"
]);
var ALLOW = /* @__PURE__ */ new Set([
	"p",
	"div",
	"span",
	"h1",
	"h2",
	"h3",
	"h4",
	"blockquote",
	"em",
	"strong",
	"i",
	"b",
	"ul",
	"ol",
	"li",
	"br",
	"hr",
	"a",
	"img",
	"figure",
	"figcaption",
	"section",
	"article",
	"sub",
	"sup",
	"small",
	"pre",
	"code"
]);
function openEpub(buffer) {
	const packed = unzipSync(new Uint8Array(buffer));
	const map = /* @__PURE__ */ new Map();
	for (const [key, value] of Object.entries(packed)) map.set(normalize(key), value);
	const container = text(map, "META-INF/container.xml");
	if (!container) throw new Error("Este EPUB não tem o container padrão.");
	const opfPath = parseXml(container).querySelector("rootfile")?.getAttribute("full-path");
	if (!opfPath) throw new Error("Este EPUB não indica o pacote.");
	const opfKey = normalize(opfPath);
	const opfXml = text(map, opfKey);
	if (!opfXml) throw new Error("O pacote do EPUB não foi encontrado.");
	const opf = parseXml(opfXml);
	const title = opf.querySelector("title")?.textContent?.trim() || "EPUB";
	const opfDir = opfKey.includes("/") ? opfKey.slice(0, opfKey.lastIndexOf("/") + 1) : "";
	const manifest = /* @__PURE__ */ new Map();
	opf.querySelectorAll("item").forEach((item) => {
		const id = item.getAttribute("id");
		const href = item.getAttribute("href");
		if (!id || !href) return;
		manifest.set(id, {
			href: resolvePath(opfDir, href),
			type: item.getAttribute("media-type") || ""
		});
	});
	const titles = [];
	const hrefs = [];
	opf.querySelectorAll("itemref").forEach((ref) => {
		const item = manifest.get(ref.getAttribute("idref") || "");
		if (!item) return;
		if (!(item.type.includes("html") || /\.x?html?$/.test(item.href))) return;
		hrefs.push(item.href);
		titles.push(`Trecho ${titles.length + 1}`);
	});
	if (!hrefs.length) throw new Error("Este EPUB não tem capítulos legíveis.");
	return {
		title,
		titles,
		render(index) {
			const href = hrefs[Math.max(0, Math.min(hrefs.length - 1, index))];
			const raw = text(map, href);
			const urls = [];
			if (!raw) return {
				html: "<p>Capítulo vazio.</p>",
				urls
			};
			const source = parseMaybeHtml(raw);
			const clean = document.implementation.createHTMLDocument("");
			const root = source.body || source.documentElement;
			const base = href.includes("/") ? href.slice(0, href.lastIndexOf("/") + 1) : "";
			if (root) copyChildren(root, clean.body, clean, map, base, urls);
			return {
				html: clean.body.innerHTML,
				urls
			};
		}
	};
}
function copyChildren(source, target, doc, map, base, urls) {
	source.childNodes.forEach((node) => {
		const next = cleanNode(node, doc, map, base, urls);
		if (next) target.appendChild(next);
	});
}
function cleanNode(node, doc, map, base, urls) {
	if (node.nodeType === Node.TEXT_NODE) return doc.createTextNode(node.textContent || "");
	if (node.nodeType !== Node.ELEMENT_NODE) return null;
	const element = node;
	const tag = element.tagName.toLowerCase();
	if (DROP.has(tag)) return null;
	if (tag === "img") {
		const key = resolvePath(base, element.getAttribute("src") || "");
		const bytes = key ? map.get(key) : void 0;
		if (!bytes) return null;
		const copy = new Uint8Array(bytes.byteLength);
		copy.set(bytes);
		const url = URL.createObjectURL(new Blob([copy], { type: sniff(bytes) }));
		urls.push(url);
		const image = doc.createElement("img");
		image.alt = element.getAttribute("alt") || "";
		image.src = url;
		return image;
	}
	if (!ALLOW.has(tag)) {
		const fragment = doc.createDocumentFragment();
		copyChildren(element, fragment, doc, map, base, urls);
		return fragment;
	}
	const copy = doc.createElement(tag);
	if (tag === "a") {
		const href = element.getAttribute("href") || "";
		if (href.startsWith("#") || href.startsWith("https://") || href.startsWith("http://")) {
			copy.setAttribute("href", href);
			copy.setAttribute("rel", "noreferrer");
			if (href.startsWith("http")) copy.setAttribute("target", "_blank");
		}
	}
	copyChildren(element, copy, doc, map, base, urls);
	return copy;
}
function parseXml(source) {
	const doc = new DOMParser().parseFromString(source, "application/xml");
	if (doc.querySelector("parsererror")) throw new Error("XML do EPUB está danificado.");
	return doc;
}
function parseMaybeHtml(source) {
	const xml = new DOMParser().parseFromString(source, "application/xhtml+xml");
	if (!xml.querySelector("parsererror")) return xml;
	return new DOMParser().parseFromString(source, "text/html");
}
function text(map, key) {
	const bytes = map.get(normalize(key));
	if (!bytes) return null;
	return new TextDecoder("utf-8").decode(bytes);
}
function normalize(path) {
	const parts = [];
	for (const part of decodeURIComponent(path).split(/[/\\]/)) {
		if (!part || part === ".") continue;
		if (part === "..") parts.pop();
		else parts.push(part);
	}
	return parts.join("/");
}
function resolvePath(base, href) {
	const clean = href.split("#")[0]?.split("?")[0] ?? "";
	if (!clean || clean.startsWith("data:") || clean.startsWith("javascript:")) return "";
	return normalize(clean.startsWith("/") ? clean.slice(1) : base + clean);
}
function sniff(bytes) {
	if (bytes[0] === 137 && bytes[1] === 80) return "image/png";
	if (bytes[0] === 255 && bytes[1] === 216) return "image/jpeg";
	if (bytes.length > 12 && String.fromCharCode(...bytes.subarray(0, 4)) === "RIFF") return "image/webp";
	return "application/octet-stream";
}
function EpubView({ data, initialIndex, onIndex }) {
	const [book, setBook] = (0, import_react.useState)(null);
	const [index, setIndex] = (0, import_react.useState)(Math.max(0, initialIndex));
	const [html, setHtml] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const urls = (0, import_react.useRef)([]);
	const onIndexRef = (0, import_react.useRef)(onIndex);
	onIndexRef.current = onIndex;
	(0, import_react.useEffect)(() => {
		try {
			const opened = openEpub(data.slice(0));
			setBook(opened);
			setIndex((current) => Math.min(current, Math.max(0, opened.titles.length - 1)));
		} catch (reason) {
			setError(reason instanceof Error ? reason.message : "Não foi possível abrir o EPUB.");
		}
	}, [data]);
	(0, import_react.useEffect)(() => {
		if (!book) return;
		urls.current.forEach((url) => URL.revokeObjectURL(url));
		const rendered = book.render(index);
		urls.current = rendered.urls;
		setHtml(rendered.html);
		return () => {
			urls.current.forEach((url) => URL.revokeObjectURL(url));
			urls.current = [];
		};
	}, [book, index]);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { message: error });
	if (!book) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Abrindo EPUB…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
			className: "reader-body max-w-[65ch] text-lg leading-relaxed",
			dangerouslySetInnerHTML: { __html: html }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "secondary",
					disabled: index <= 0,
					onClick: () => setIndex((value) => {
						const next = value - 1;
						onIndexRef.current(next, book.titles.length);
						return next;
					}),
					children: "Anterior"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm tabular-nums text-muted",
					children: [
						index + 1,
						" / ",
						book.titles.length
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "secondary",
					disabled: index >= book.titles.length - 1,
					onClick: () => setIndex((value) => {
						const next = value + 1;
						onIndexRef.current(next, book.titles.length);
						return next;
					}),
					children: "Seguinte"
				})
			]
		})]
	});
}
function PdfView({ data, initialPage, onPage }) {
	const canvasRef = (0, import_react.useRef)(null);
	const onPageRef = (0, import_react.useRef)(onPage);
	onPageRef.current = onPage;
	const [page, setPage] = (0, import_react.useState)(Math.max(1, initialPage));
	const [total, setTotal] = (0, import_react.useState)(0);
	const [failed, setFailed] = (0, import_react.useState)("");
	const [blobUrl, setBlobUrl] = (0, import_react.useState)(null);
	const docRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let cancel = false;
		const taskRef = {};
		(async () => {
			try {
				const pdfjs = await import("../_libs/pdfjs-dist.mjs").then((n) => n.t);
				const worker = await import("./pdf.worker.min-DMv0gVyV.mjs");
				pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
				const task = pdfjs.getDocument({ data: data.slice(0) });
				taskRef.destroy = () => task.destroy();
				const doc = await task.promise;
				if (cancel) {
					await doc.destroy?.();
					return;
				}
				docRef.current = doc;
				setTotal(doc.numPages);
				setPage((current) => Math.min(Math.max(1, current), doc.numPages));
			} catch (error) {
				if (cancel) return;
				setFailed(error instanceof Error ? error.message : "Não foi possível abrir o PDF com o leitor.");
				const url = URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
				setBlobUrl(url);
			}
		})();
		return () => {
			cancel = true;
			taskRef.destroy?.();
			docRef.current?.destroy?.();
			docRef.current = null;
		};
	}, [data]);
	(0, import_react.useEffect)(() => {
		const doc = docRef.current;
		const canvas = canvasRef.current;
		if (!doc || !canvas || failed) return;
		let cancel = false;
		(async () => {
			const pdfPage = await doc.getPage(page);
			if (cancel) return;
			const base = pdfPage.getViewport({ scale: 1 });
			const width = Math.min(canvas.parentElement?.clientWidth || 720, 760);
			const viewport = pdfPage.getViewport({ scale: width / base.width });
			canvas.width = Math.floor(viewport.width);
			canvas.height = Math.floor(viewport.height);
			await pdfPage.render({
				canvas,
				viewport
			}).promise;
		})();
		return () => {
			cancel = true;
		};
	}, [
		page,
		total,
		failed
	]);
	(0, import_react.useEffect)(() => () => {
		if (blobUrl) URL.revokeObjectURL(blobUrl);
	}, [blobUrl]);
	if (failed && blobUrl) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { message: `${failed} Abrimos o visualizador nativo do navegador.` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
			title: "Leitor de PDF",
			src: blobUrl,
			className: "h-[70vh] w-full rounded-lg bg-paper"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-auto rounded-lg bg-paper p-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "mx-auto h-auto max-w-full"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "secondary",
					disabled: page <= 1,
					onClick: () => setPage((value) => {
						const next = value - 1;
						onPageRef.current(next, total);
						return next;
					}),
					children: "Página anterior"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm tabular-nums text-muted",
					children: total ? `${page} / ${total}` : "Abrindo PDF…"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "secondary",
					disabled: !total || page >= total,
					onClick: () => setPage((value) => {
						const next = value + 1;
						onPageRef.current(next, total);
						return next;
					}),
					children: "Próxima página"
				})
			]
		})]
	});
}
function ReaderScreen({ book }) {
	const { user, isPending } = useCurrentUserState();
	const text = book.chapters;
	const pdf = book.files.find((file) => file.kind === "pdf");
	const epub = book.files.find((file) => file.kind === "epub");
	const modes = [
		...text.length ? ["text"] : [],
		...epub ? ["epub"] : [],
		...pdf ? ["pdf"] : []
	];
	const [mode, setMode] = (0, import_react.useState)(modes[0] ?? "text");
	const [chapter, setChapter] = (0, import_react.useState)(0);
	const [size, setSize] = (0, import_react.useState)(19);
	const [paper, setPaper] = (0, import_react.useState)(false);
	const [file, setFile] = (0, import_react.useState)(null);
	const [fileError, setFileError] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [mark, setMark] = (0, import_react.useState)("");
	const fileId = mode === "pdf" ? pdf?.id : mode === "epub" ? epub?.id : void 0;
	(0, import_react.useEffect)(() => {
		const stored = localStorage.getItem("nebbook-reader");
		if (!stored) return;
		try {
			const pref = JSON.parse(stored);
			if (pref.size) setSize(pref.size);
			if (typeof pref.paper === "boolean") setPaper(pref.paper);
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		localStorage.setItem("nebbook-reader", JSON.stringify({
			size,
			paper
		}));
	}, [size, paper]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		let cancel = false;
		getProgress({ data: book.slug }).then((progress) => {
			if (cancel || !progress) return;
			const [kind, raw] = progress.locator.split(":");
			const value = Number(raw);
			if (kind === "c" && text.length) {
				setMode("text");
				setChapter(Math.min(value, text.length - 1));
			} else if (kind === "e" && epub) setMode("epub");
			else if (kind === "p" && pdf) setMode("pdf");
		}).catch(() => void 0);
		return () => {
			cancel = true;
		};
	}, [
		user?.id,
		book.slug,
		epub,
		pdf,
		text.length
	]);
	(0, import_react.useEffect)(() => {
		if (!fileId) return;
		let cancel = false;
		setFile(null);
		setFileError("");
		fetchBookFile(fileId).then((result) => {
			if (!cancel) setFile(result.buffer);
		}).catch((error) => {
			if (!cancel) setFileError(error instanceof Error ? error.message : "Falha ao abrir o arquivo.");
		});
		return () => {
			cancel = true;
		};
	}, [fileId]);
	function locator() {
		if (mode === "text") return `c:${chapter}`;
		if (mode === "epub") return `e:${chapter}`;
		return `p:${chapter || 1}`;
	}
	async function remember(nextLocator, pct) {
		if (!user) return;
		await saveProgress({ data: {
			slug: book.slug,
			locator: nextLocator,
			progressPct: pct
		} }).catch(() => void 0);
	}
	const current = text[chapter];
	const paragraphs = current?.body.split(/\n{2,}/) ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-3xl px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/livros/$slug",
					params: { slug: book.slug },
					className: "hover:text-fg",
					children: book.title
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center gap-2",
				children: [
					modes.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setMode(item);
							setChapter(0);
						},
						className: cn("min-h-11 rounded-full px-4 text-sm", mode === item ? "bg-violet text-white" : "border border-line"),
						children: item === "text" ? "Texto" : item === "pdf" ? "PDF" : "EPUB"
					}, item)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 rounded-full border border-line px-3 text-sm",
						onClick: () => setSize((value) => Math.max(16, value - 1)),
						children: "A−"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 rounded-full border border-line px-3 text-sm",
						onClick: () => setSize((value) => Math.min(24, value + 1)),
						children: "A+"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 rounded-full border border-line px-3 text-sm",
						onClick: () => setPaper((value) => !value),
						children: paper ? "Céu" : "Papel"
					}),
					book.allowDownload && fileId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "secondary",
						onClick: () => {
							fetchBookFile(fileId, true).then((result) => saveBlob(result.buffer, result.mime, `${book.slug}.${mode === "pdf" ? "pdf" : "epub"}`));
						},
						children: "Baixar"
					}) : null
				]
			}),
			!isPending && !user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: "Entre na conta para guardar o ponto de leitura. O tamanho da letra fica só neste aparelho."
			}) : null,
			user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 flex flex-col gap-2 sm:flex-row",
				onSubmit: (event) => {
					event.preventDefault();
					toggleBookmark({ data: {
						slug: book.slug,
						locator: locator(),
						note
					} }).then((result) => setMark(result.saved ? "Marca salva na sua conta." : "Marca removida.")).catch((error) => setMark(error instanceof Error ? error.message : "Não foi possível marcar."));
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: note,
					onChange: (event) => setNote(event.target.value),
					placeholder: "Nota da marca, opcional",
					className: "min-h-11 flex-1 rounded-md border border-line bg-bg px-3 text-sm",
					maxLength: 240
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: "secondary",
					children: "Marcar página"
				})]
			}) : null,
			mark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: mark
			}) : null,
			mode === "text" && text.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "mt-6 flex gap-2 overflow-x-auto pb-1",
				"aria-label": "Capítulos",
				children: text.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"aria-current": index === chapter ? "true" : void 0,
					onClick: () => {
						setChapter(index);
						remember(`c:${index}`, Math.round((index + 1) / text.length * 100));
					},
					className: cn("min-h-11 shrink-0 rounded-full px-4 text-sm", index === chapter ? "bg-surface-2 text-fg" : "border border-line text-muted"),
					children: [
						index + 1,
						". ",
						item.title
					]
				}, item.id))
			}) : null,
			mode === "text" && text.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 h-1 overflow-hidden rounded-full bg-surface",
				role: "progressbar",
				"aria-valuemin": 0,
				"aria-valuemax": 100,
				"aria-valuenow": Math.round((chapter + 1) / text.length * 100),
				"aria-label": "Progresso da leitura",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-cyan",
					style: { width: `${Math.round((chapter + 1) / text.length * 100)}%` }
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("mt-8 rounded-xl px-1 py-2 sm:px-6", paper ? "bg-paper text-ink" : "text-fg"),
				style: { fontSize: size },
				children: [
					!modes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { message: "Esta obra ainda não tem texto nem arquivo de leitura." }) : null,
					mode === "text" && current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "reader-body mx-auto max-w-[65ch] font-serif leading-relaxed",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mb-6 font-sans text-2xl font-medium",
								children: current.title
							}),
							paragraphs.map((paragraph, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: paragraph.split("\n").map((line, lineIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [lineIndex > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}) : null, line] }, lineIndex)) }, index)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-10 flex items-center justify-between gap-3 font-sans text-base",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "secondary",
										disabled: chapter <= 0,
										onClick: () => {
											const next = chapter - 1;
											setChapter(next);
											remember(`c:${next}`, Math.round((next + 1) / text.length * 100));
										},
										children: "Anterior"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-sm tabular-nums opacity-70",
										children: [
											chapter + 1,
											" / ",
											text.length
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "secondary",
										disabled: chapter >= text.length - 1,
										onClick: () => {
											const next = chapter + 1;
											setChapter(next);
											remember(`c:${next}`, Math.round((next + 1) / text.length * 100));
										},
										children: "Seguinte"
									})
								]
							})
						]
					}) : null,
					mode !== "text" && fileError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { message: fileError }) : null,
					mode === "pdf" && file ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PdfView, {
						data: file,
						initialPage: 1,
						onPage: (page, total) => {
							remember(`p:${page}`, Math.round(page / total * 100));
						}
					}) : null,
					mode === "epub" && file ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-serif",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EpubView, {
							data: file,
							initialIndex: 0,
							onIndex: (index, total) => {
								setChapter(index);
								remember(`e:${index}`, Math.round((index + 1) / total * 100));
							}
						})
					}) : null,
					mode !== "text" && fileId && !file && !fileError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Carregando arquivo…"
					}) : null
				]
			})
		]
	});
}
function ReadPage() {
	const published = Route$3.useLoaderData();
	const { slug } = Route$3.useParams();
	const { user, isPending } = useCurrentUserState();
	const [privateBook, setPrivateBook] = (0, import_react.useState)(null);
	const [checked, setChecked] = (0, import_react.useState)(false);
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
	if (!published && (isPending || user && !checked)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { label: "Abrindo a leitura…" });
	const book = published ?? privateBook;
	if (!book) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "mx-auto max-w-3xl px-4 py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotFoundState, {
			title: "Leitura indisponível",
			body: "A obra não está publicada ou você não tem acesso."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReaderScreen, { book });
}
//#endregion
export { ReadPage as component };
