import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/public.functions-D1O5duR9.js
var listCatalog_createServerFn_handler = createServerRpc({
	id: "3953929d3b4a3ad043db89113915ce150a154b44892366b3eb160ab8853d9510",
	name: "listCatalog",
	filename: "src/lib/nebbook/public.functions.ts"
}, (opts) => listCatalog.__executeServer(opts));
var listCatalog = createServerFn({ method: "GET" }).validator((input) => ({
	q: String(input?.q ?? "").slice(0, 80),
	categoria: String(input?.categoria ?? "").slice(0, 40)
})).handler(listCatalog_createServerFn_handler, async ({ data }) => {
	const { listCatalog: run } = await import("./queries.server-BltQr67Z.mjs");
	return run(data);
});
var listCategories_createServerFn_handler = createServerRpc({
	id: "53003133242d06948925bcb413b84d18d8943eb67315f7c442ba0f8ec00be5c8",
	name: "listCategories",
	filename: "src/lib/nebbook/public.functions.ts"
}, (opts) => listCategories.__executeServer(opts));
var listCategories = createServerFn({ method: "GET" }).handler(listCategories_createServerFn_handler, async () => {
	const { listCategories: run } = await import("./queries.server-BltQr67Z.mjs");
	return run();
});
var getPublishedBook_createServerFn_handler = createServerRpc({
	id: "c3a97624b058970c609685f694e60e554a374bf867921f9b7df19658facef932",
	name: "getPublishedBook",
	filename: "src/lib/nebbook/public.functions.ts"
}, (opts) => getPublishedBook.__executeServer(opts));
var getPublishedBook = createServerFn({ method: "GET" }).validator((slug) => String(slug ?? "").slice(0, 160)).handler(getPublishedBook_createServerFn_handler, async ({ data }) => {
	const { getPublishedBook: run } = await import("./queries.server-BltQr67Z.mjs");
	return run(data);
});
var listAuthors_createServerFn_handler = createServerRpc({
	id: "6827d29f8e5c8eb25fcc43b955b3fb2c4179091adcc6c41afeb2d73aa3d55b17",
	name: "listAuthors",
	filename: "src/lib/nebbook/public.functions.ts"
}, (opts) => listAuthors.__executeServer(opts));
var listAuthors = createServerFn({ method: "GET" }).handler(listAuthors_createServerFn_handler, async () => {
	const { listAuthors: run } = await import("./queries.server-BltQr67Z.mjs");
	return run();
});
var getAuthor_createServerFn_handler = createServerRpc({
	id: "2f5e135577ea7017fada742758c8276fd392c3fd282dce4ec0aa6dc5ffe18863",
	name: "getAuthor",
	filename: "src/lib/nebbook/public.functions.ts"
}, (opts) => getAuthor.__executeServer(opts));
var getAuthor = createServerFn({ method: "GET" }).validator((slug) => String(slug ?? "").slice(0, 160)).handler(getAuthor_createServerFn_handler, async ({ data }) => {
	const { getAuthor: run } = await import("./queries.server-BltQr67Z.mjs");
	return run(data);
});
//#endregion
export { getAuthor_createServerFn_handler, getPublishedBook_createServerFn_handler, listAuthors_createServerFn_handler, listCatalog_createServerFn_handler, listCategories_createServerFn_handler };
