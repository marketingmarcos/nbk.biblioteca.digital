import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, v as createFileRoute, w as require_jsx_runtime, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn, s as __exportAll } from "./ssr.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { n as auth } from "./server-Ck8v77W-.mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createSsrRpc-B2Izd0c7.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/public.functions-BfhLzjcm.js
var listCatalog = createServerFn({ method: "GET" }).validator((input) => ({
	q: String(input?.q ?? "").slice(0, 80),
	categoria: String(input?.categoria ?? "").slice(0, 40)
})).handler(createSsrRpc("3953929d3b4a3ad043db89113915ce150a154b44892366b3eb160ab8853d9510"));
var listCategories = createServerFn({ method: "GET" }).handler(createSsrRpc("53003133242d06948925bcb413b84d18d8943eb67315f7c442ba0f8ec00be5c8"));
var getPublishedBook = createServerFn({ method: "GET" }).validator((slug) => String(slug ?? "").slice(0, 160)).handler(createSsrRpc("c3a97624b058970c609685f694e60e554a374bf867921f9b7df19658facef932"));
var listAuthors = createServerFn({ method: "GET" }).handler(createSsrRpc("6827d29f8e5c8eb25fcc43b955b3fb2c4179091adcc6c41afeb2d73aa3d55b17"));
var getAuthor = createServerFn({ method: "GET" }).validator((slug) => String(slug ?? "").slice(0, 160)).handler(createSsrRpc("2f5e135577ea7017fada742758c8276fd392c3fd282dce4ec0aa6dc5ffe18863"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-K_C10-Xj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "Algo inesperado aconteceu. Tente recarregar a página.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
				className: "size-10 text-danger",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Não foi possível abrir esta página"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted",
				children: errorMessage(error)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-2 text-sm text-cyan underline-offset-4 hover:underline",
				children: "Voltar ao início"
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
/** Identidade da plataforma. Troque aqui para renomear a marca na interface. */
var brand = {
	id: "nebbook",
	name: "Nebbook",
	tagline: "Cada livro é um universo.",
	description: "Biblioteca digital gratuita para leitores e autores independentes. A publicação passa por curadoria humana."
};
var styles_default = "/assets/styles-CATxrGFw.css";
var Route$18 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: brand.name },
			{
				name: "description",
				content: brand.description
			},
			{
				name: "theme-color",
				content: "#080B18"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400&family=Outfit:wght@400;500;600&display=swap"
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt-BR",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$14 = () => import("../_-C_G5ONzj.mjs");
var Route$17 = createFileRoute("/$")({
	head: () => ({ meta: [{ title: "Página não encontrada · Nebbook" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("../_shell-B2gw-tCQ.mjs");
var Route$16 = createFileRoute("/_shell")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("../_shell-5k9Oubs9.mjs");
var Route$15 = createFileRoute("/_shell/")({
	loader: () => listCatalog({ data: {
		q: "",
		categoria: ""
	} }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./admin-08vBwWOm.mjs");
var Route$14 = createFileRoute("/_shell/admin")({
	head: () => ({ meta: [{ title: "Equipe editorial · Nebbook" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./autores-DyLaHGCr.mjs");
var Route$13 = createFileRoute("/_shell/autores")({
	loader: () => listAuthors(),
	head: () => ({ meta: [{ title: "Autores · Nebbook" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./catalogo-DysT0f89.mjs");
var Route$12 = createFileRoute("/_shell/catalogo")({
	validateSearch: (search) => ({
		q: typeof search.q === "string" ? search.q.slice(0, 80) : "",
		categoria: typeof search.categoria === "string" ? search.categoria.slice(0, 40) : ""
	}),
	loaderDeps: ({ search }) => search,
	loader: async ({ deps }) => {
		const [books, categories] = await Promise.all([listCatalog({ data: deps }), listCategories()]);
		return {
			books,
			categories,
			search: deps
		};
	},
	head: () => ({ meta: [{ title: "Catálogo · Nebbook" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./conta-BxXtgbl_.mjs");
var Route$11 = createFileRoute("/_shell/conta")({
	head: () => ({ meta: [{ title: "Sua conta · Nebbook" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./direitos-DsOgaz1C.mjs");
var Route$10 = createFileRoute("/_shell/direitos")({
	validateSearch: (search) => ({ obra: typeof search.obra === "string" ? search.obra.slice(0, 160) : "" }),
	loaderDeps: ({ search }) => search,
	loader: async ({ deps }) => {
		return {
			books: await listCatalog({ data: {
				q: "",
				categoria: ""
			} }),
			obra: deps.obra
		};
	},
	head: () => ({ meta: [{ title: "Direitos autorais · Nebbook" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./enviar-B2M-3VtY.mjs");
var Route$9 = createFileRoute("/_shell/enviar")({
	loader: () => listCategories(),
	head: () => ({ meta: [{ title: "Enviar obra · Nebbook" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./login-GJhc0ufc.mjs");
var Route$8 = createFileRoute("/_shell/login")({
	head: () => ({ meta: [{ title: `Entrar · ${brand.name}` }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./privacidade-BEouHZCs.mjs");
var Route$7 = createFileRoute("/_shell/privacidade")({
	head: () => ({ meta: [{ title: "Privacidade · Nebbook" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./termos-SG800kmF.mjs");
var Route$6 = createFileRoute("/_shell/termos")({
	head: () => ({ meta: [{ title: "Termos · Nebbook" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
function json(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "content-type": "application/json; charset=utf-8" }
	});
}
function sameOrigin$1(request) {
	const site = request.headers.get("sec-fetch-site");
	if (!site || site === "same-origin" || site === "none") return true;
	return false;
}
var Route$5 = createFileRoute("/api/uploads")({ server: { handlers: { POST: async ({ request }) => {
	try {
		if (!sameOrigin$1(request)) return json({ error: "Origem não permitida." }, 403);
		if (Number(request.headers.get("content-length") || 0) > 9437184) return json({ error: "Arquivo acima do limite." }, 413);
		const { getSessionUser } = await import("./verify.server-Bx6VLroM.mjs");
		const header = request.headers.get("authorization") || "";
		const user = await getSessionUser(header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : void 0);
		if (!user) return json({ error: "É preciso entrar para enviar um arquivo." }, 401);
		const { allowUploadRate } = await import("./files.server-C_fXGDC2.mjs");
		if (!allowUploadRate(user.id)) return json({ error: "Limite de envios desta hora atingido." }, 429);
		const form = await request.formData();
		const bookId = String(form.get("bookId") || "");
		const kind = String(form.get("kind") || "");
		const file = form.get("file");
		if (!/^[a-zA-Z0-9_-]{1,80}$/.test(bookId)) return json({ error: "Obra inválida." }, 400);
		if (kind !== "pdf" && kind !== "epub" && kind !== "cover") return json({ error: "Tipo de arquivo não aceito." }, 400);
		if (!(file instanceof File)) return json({ error: "Arquivo ausente." }, 400);
		const bytes = new Uint8Array(await file.arrayBuffer());
		const { validateUpload } = await import("./validate-bytes-BFmDtifi.mjs");
		const checked = validateUpload({
			kind,
			bytes,
			declaredMime: file.type || "",
			filename: file.name || ""
		});
		if (!checked.ok) return json({ error: checked.error }, 400);
		const { assertUpload, storeFile } = await import("./queries.server-BltQr67Z.mjs");
		const gate = await assertUpload(user.id, bookId, kind);
		const digest = await crypto.subtle.digest("SHA-256", new Uint8Array(bytes));
		const sha256 = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
		return json(await storeFile({
			userId: user.id,
			bookId,
			kind,
			mime: checked.value.mime,
			bytes,
			sha256,
			originalName: file.name || `arquivo.${checked.value.ext}`,
			bucket: gate.bucket
		}));
	} catch (error) {
		const message = error instanceof Error ? error.message : "Falha no envio.";
		const status = typeof error === "object" && error && "status" in error ? Number(error.status) : 400;
		return json({ error: message }, Number.isFinite(status) ? status : 400);
	}
} } } });
var $$splitComponentImporter$2 = () => import("./autores._slug-CouR2gVy.mjs");
var Route$4 = createFileRoute("/_shell/autores/$slug")({
	loader: ({ params }) => getAuthor({ data: params.slug }),
	head: ({ loaderData }) => ({ meta: [{ title: loaderData ? `${loaderData.name} · Nebbook` : "Autor · Nebbook" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./ler._slug-BOqPJHK6.mjs");
var Route$3 = createFileRoute("/_shell/ler/$slug")({
	loader: ({ params }) => getPublishedBook({ data: params.slug }),
	head: ({ loaderData }) => ({ meta: [{ title: loaderData ? `Ler ${loaderData.title} · Nebbook` : "Leitura · Nebbook" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./livros._slug-CB1PV4LN.mjs");
var Route$2 = createFileRoute("/_shell/livros/$slug")({
	loader: ({ params }) => getPublishedBook({ data: params.slug }),
	head: ({ loaderData }) => ({ meta: [{ title: loaderData ? `${loaderData.title} · Nebbook` : "Livro · Nebbook" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var Route$1 = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
function sameOrigin(request) {
	const site = request.headers.get("sec-fetch-site");
	if (!site || site === "same-origin" || site === "none") return true;
	const dest = request.headers.get("sec-fetch-dest");
	return request.headers.get("sec-fetch-mode") === "navigate" && request.method === "GET" && dest !== "object" && dest !== "embed";
}
var Route = createFileRoute("/api/files/$fileId")({ server: { handlers: { GET: async ({ request, params }) => {
	if (!sameOrigin(request)) return new Response("Origem não permitida.", { status: 403 });
	const id = params.fileId;
	if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id)) return new Response("Não encontrado.", { status: 404 });
	const download = new URL(request.url).searchParams.get("download") === "1";
	const { getSessionUser } = await import("./verify.server-Bx6VLroM.mjs");
	const header = request.headers.get("authorization") || "";
	const user = await getSessionUser(header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : void 0);
	const { loadFile, roleFor } = await import("./queries.server-BltQr67Z.mjs");
	const { bytesFromDb, fileAccess, safeFilename } = await import("./files.server-C_fXGDC2.mjs");
	const row = await loadFile(id);
	if (!row) return new Response("Não encontrado.", { status: 404 });
	const role = user ? await roleFor(user.id) : null;
	const access = fileAccess({
		status: row.status,
		allowDownload: Boolean(row.allow_download),
		ownerUserId: row.owner_user_id,
		userId: user?.id ?? null,
		role,
		download
	});
	if (!access.ok) return new Response(access.error, { status: access.status });
	const bytes = bytesFromDb(row.content);
	const ext = row.kind === "pdf" ? "pdf" : row.kind === "epub" ? "epub" : row.mime === "image/png" ? "png" : row.mime === "image/webp" ? "webp" : "jpg";
	const filename = safeFilename(row.original_name, ext);
	const publishedCover = row.status === "published" && row.kind === "cover" && !download;
	return new Response(Buffer.from(bytes), { headers: {
		"content-type": row.mime,
		"content-length": String(bytes.byteLength),
		"content-disposition": `${download ? "attachment" : "inline"}; filename="${filename}"`,
		"x-content-type-options": "nosniff",
		"cache-control": publishedCover ? "public, max-age=3600" : "private, no-store",
		"x-robots-tag": "noindex"
	} });
} } } });
var SplatRoute = Route$17.update({
	id: "/$",
	path: "/$",
	getParentRoute: () => Route$18
});
var ShellRoute = Route$16.update({
	id: "/_shell",
	getParentRoute: () => Route$18
});
var ShellIndexRoute = Route$15.update({
	id: "/",
	path: "/",
	getParentRoute: () => ShellRoute
});
var ShellAdminRoute = Route$14.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => ShellRoute
});
var ShellAutoresRoute = Route$13.update({
	id: "/autores",
	path: "/autores",
	getParentRoute: () => ShellRoute
});
var ShellCatalogoRoute = Route$12.update({
	id: "/catalogo",
	path: "/catalogo",
	getParentRoute: () => ShellRoute
});
var ShellContaRoute = Route$11.update({
	id: "/conta",
	path: "/conta",
	getParentRoute: () => ShellRoute
});
var ShellDireitosRoute = Route$10.update({
	id: "/direitos",
	path: "/direitos",
	getParentRoute: () => ShellRoute
});
var ShellEnviarRoute = Route$9.update({
	id: "/enviar",
	path: "/enviar",
	getParentRoute: () => ShellRoute
});
var ShellLoginRoute = Route$8.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => ShellRoute
});
var ShellPrivacidadeRoute = Route$7.update({
	id: "/privacidade",
	path: "/privacidade",
	getParentRoute: () => ShellRoute
});
var ShellTermosRoute = Route$6.update({
	id: "/termos",
	path: "/termos",
	getParentRoute: () => ShellRoute
});
var ApiUploadsRoute = Route$5.update({
	id: "/api/uploads",
	path: "/api/uploads",
	getParentRoute: () => Route$18
});
var ShellAutoresSlugRoute = Route$4.update({
	id: "/$slug",
	path: "/$slug",
	getParentRoute: () => ShellAutoresRoute
});
var ShellLerSlugRoute = Route$3.update({
	id: "/ler/$slug",
	path: "/ler/$slug",
	getParentRoute: () => ShellRoute
});
var ShellLivrosSlugRoute = Route$2.update({
	id: "/livros/$slug",
	path: "/livros/$slug",
	getParentRoute: () => ShellRoute
});
var ApiAuthSplatRoute = Route$1.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$18
});
var ApiFilesFileIdRoute = Route.update({
	id: "/api/files/$fileId",
	path: "/api/files/$fileId",
	getParentRoute: () => Route$18
});
var ShellAutoresRouteChildren = { ShellAutoresSlugRoute };
var ShellRouteChildren = {
	ShellAdminRoute,
	ShellAutoresRoute: ShellAutoresRoute._addFileChildren(ShellAutoresRouteChildren),
	ShellCatalogoRoute,
	ShellContaRoute,
	ShellDireitosRoute,
	ShellEnviarRoute,
	ShellLoginRoute,
	ShellPrivacidadeRoute,
	ShellTermosRoute,
	ShellIndexRoute,
	ShellLerSlugRoute,
	ShellLivrosSlugRoute
};
var rootRouteChildren = {
	SplatRoute,
	ShellRoute: ShellRoute._addFileChildren(ShellRouteChildren),
	ApiUploadsRoute,
	ApiAuthSplatRoute,
	ApiFilesFileIdRoute
};
var routeTree = Route$18._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Route$9 as a, Route$13 as c, createSsrRpc as d, Route$4 as i, Route$15 as l, Route$2 as n, Route$10 as o, Route$3 as r, Route$12 as s, router_exports as t, brand as u };
