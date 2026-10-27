import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-D-peLKt5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account.functions-Db3ym0vr.js
var ensureProfile_createServerFn_handler = createServerRpc({
	id: "a6efff1139163054d67ffa8270a180cae6dd14580fe6965107cbbd110b7b0474",
	name: "ensureProfile",
	filename: "src/lib/nebbook/account.functions.ts"
}, (opts) => ensureProfile.__executeServer(opts));
var ensureProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ intent: input?.intent === "author" ? "author" : "reader" })).handler(ensureProfile_createServerFn_handler, async ({ context, data }) => {
	const { ensureProfile: run } = await import("./queries.server-BltQr67Z.mjs");
	return { role: await run(context.userId, data.intent) };
});
var getAccount_createServerFn_handler = createServerRpc({
	id: "d65fa36b3b94b84879e12b3225fdb42b158d57c4e170dd208a22fba6505ee20c",
	name: "getAccount",
	filename: "src/lib/nebbook/account.functions.ts"
}, (opts) => getAccount.__executeServer(opts));
var getAccount = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAccount_createServerFn_handler, async ({ context }) => {
	const { getAccount: run } = await import("./queries.server-BltQr67Z.mjs");
	return run(context.userId);
});
var updateProfile_createServerFn_handler = createServerRpc({
	id: "eae48d06d9afffc6174b2f5281497bb17fd3aed55f03300b30c0452e17fd5347",
	name: "updateProfile",
	filename: "src/lib/nebbook/account.functions.ts"
}, (opts) => updateProfile.__executeServer(opts));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	displayName: String(input?.displayName ?? "").slice(0, 80),
	bio: String(input?.bio ?? "").slice(0, 600)
})).handler(updateProfile_createServerFn_handler, async ({ context, data }) => {
	const { updateProfile: run } = await import("./queries.server-BltQr67Z.mjs");
	return run(context.userId, data.displayName, data.bio);
});
var listMyBooks_createServerFn_handler = createServerRpc({
	id: "d95a98af4ab77726175efb56d614c41ef5cdadbe259f1ab43664a1e6e4c2a51a",
	name: "listMyBooks",
	filename: "src/lib/nebbook/account.functions.ts"
}, (opts) => listMyBooks.__executeServer(opts));
var listMyBooks = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyBooks_createServerFn_handler, async ({ context }) => {
	const { listMyBooks: run } = await import("./queries.server-BltQr67Z.mjs");
	return run(context.userId);
});
var createBook_createServerFn_handler = createServerRpc({
	id: "045b9eaddac11b6e520e963d4a34a2da6339e26ad8111a089edc4795d71860ba",
	name: "createBook",
	filename: "src/lib/nebbook/account.functions.ts"
}, (opts) => createBook.__executeServer(opts));
var createBook = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createBook_createServerFn_handler, async ({ context, data }) => {
	const { createBook: run } = await import("./queries.server-BltQr67Z.mjs");
	return run(context.userId, {
		title: String(data?.title ?? ""),
		synopsis: String(data?.synopsis ?? ""),
		categorySlug: String(data?.categorySlug ?? ""),
		allowDownload: Boolean(data?.allowDownload),
		rightsHolder: String(data?.rightsHolder ?? ""),
		rightsStatement: String(data?.rightsStatement ?? ""),
		rightsConfirmed: data?.rightsConfirmed === true
	});
});
var updateDraft_createServerFn_handler = createServerRpc({
	id: "cb4e8893207e05c353134eef003d7943c08c7361771f3926ac123afc47567e4a",
	name: "updateDraft",
	filename: "src/lib/nebbook/account.functions.ts"
}, (opts) => updateDraft.__executeServer(opts));
var updateDraft = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	bookId: String(input?.bookId ?? ""),
	title: String(input?.title ?? ""),
	synopsis: String(input?.synopsis ?? ""),
	allowDownload: Boolean(input?.allowDownload)
})).handler(updateDraft_createServerFn_handler, async ({ context, data }) => {
	const { updateDraft: run } = await import("./queries.server-BltQr67Z.mjs");
	return run(context.userId, data);
});
var transitionBook_createServerFn_handler = createServerRpc({
	id: "7ee91a2fad42837a36fdb4d84eed0cc85ed81968aa4689dc3d3231f5466c529c",
	name: "transitionBook",
	filename: "src/lib/nebbook/account.functions.ts"
}, (opts) => transitionBook.__executeServer(opts));
var transitionBook = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	bookId: String(input?.bookId ?? ""),
	to: String(input?.to ?? ""),
	note: String(input?.note ?? "").slice(0, 2e3)
})).handler(transitionBook_createServerFn_handler, async ({ context, data }) => {
	const { transitionBook: run } = await import("./queries.server-BltQr67Z.mjs");
	return run(context.userId, data);
});
var saveProgress_createServerFn_handler = createServerRpc({
	id: "7ab53117f1333ed6b3bd0c13f500c36ea3625832cd6d4691b6869b04ddc23751",
	name: "saveProgress",
	filename: "src/lib/nebbook/account.functions.ts"
}, (opts) => saveProgress.__executeServer(opts));
var saveProgress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	slug: String(input?.slug ?? ""),
	locator: String(input?.locator ?? ""),
	progressPct: Number(input?.progressPct ?? 0)
})).handler(saveProgress_createServerFn_handler, async ({ context, data }) => {
	const { saveProgress: run } = await import("./queries.server-BltQr67Z.mjs");
	return run(context.userId, data);
});
var getProgress_createServerFn_handler = createServerRpc({
	id: "a87be8b410d495a29995f9d2f0f88e9e64f0cf5102a637437d766602397b9da9",
	name: "getProgress",
	filename: "src/lib/nebbook/account.functions.ts"
}, (opts) => getProgress.__executeServer(opts));
var getProgress = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((slug) => String(slug ?? "")).handler(getProgress_createServerFn_handler, async ({ context, data }) => {
	const { getProgress: run } = await import("./queries.server-BltQr67Z.mjs");
	return run(context.userId, data);
});
var toggleBookmark_createServerFn_handler = createServerRpc({
	id: "5252536bfd33a9917503384fbcf5fc1d280a360f591fe30c997e64e9d066ad3b",
	name: "toggleBookmark",
	filename: "src/lib/nebbook/account.functions.ts"
}, (opts) => toggleBookmark.__executeServer(opts));
var toggleBookmark = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	slug: String(input?.slug ?? ""),
	locator: String(input?.locator ?? ""),
	note: String(input?.note ?? "")
})).handler(toggleBookmark_createServerFn_handler, async ({ context, data }) => {
	const { toggleBookmark: run } = await import("./queries.server-BltQr67Z.mjs");
	return run(context.userId, data);
});
var getViewerBook_createServerFn_handler = createServerRpc({
	id: "ff9ba8790653ba12901e98349940fc7ed894256b378d1bd6a104451dde2de769",
	name: "getViewerBook",
	filename: "src/lib/nebbook/account.functions.ts"
}, (opts) => getViewerBook.__executeServer(opts));
var getViewerBook = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((slug) => String(slug ?? "")).handler(getViewerBook_createServerFn_handler, async ({ context, data }) => {
	const { getViewerBook: run } = await import("./queries.server-BltQr67Z.mjs");
	return run(context.userId, data);
});
var getAdminDesk_createServerFn_handler = createServerRpc({
	id: "fbe9eed1755616be4cee090501ac9319ac8ffb9d998f82c90c66810437940ccf",
	name: "getAdminDesk",
	filename: "src/lib/nebbook/account.functions.ts"
}, (opts) => getAdminDesk.__executeServer(opts));
var getAdminDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminDesk_createServerFn_handler, async ({ context }) => {
	const { getAdminDesk: run } = await import("./queries.server-BltQr67Z.mjs");
	return run(context.userId);
});
var claimInitialAdmin_createServerFn_handler = createServerRpc({
	id: "cae1b3990883c44bc825b1203d90454f0b0ce14106418613d29c4daa451a05b7",
	name: "claimInitialAdmin",
	filename: "src/lib/nebbook/account.functions.ts"
}, (opts) => claimInitialAdmin.__executeServer(opts));
var claimInitialAdmin = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(claimInitialAdmin_createServerFn_handler, async ({ context }) => {
	const { claimInitialAdmin: run } = await import("./queries.server-BltQr67Z.mjs");
	return run(context.userId);
});
var assignRole_createServerFn_handler = createServerRpc({
	id: "b3528485bef1445760cf10c3fd6541b26409293ff9a9bb3cc94f7d94922895ca",
	name: "assignRole",
	filename: "src/lib/nebbook/account.functions.ts"
}, (opts) => assignRole.__executeServer(opts));
var assignRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	userId: String(input?.userId ?? ""),
	role: String(input?.role ?? "")
})).handler(assignRole_createServerFn_handler, async ({ context, data }) => {
	const { assignRole: run } = await import("./queries.server-BltQr67Z.mjs");
	return run(context.userId, data.userId, data.role);
});
var fileNotice_createServerFn_handler = createServerRpc({
	id: "13b19e0984e4989f4f40c1428f60a362bb73d5e048259e1f1a8746071a268ed3",
	name: "fileNotice",
	filename: "src/lib/nebbook/account.functions.ts"
}, (opts) => fileNotice.__executeServer(opts));
var fileNotice = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	bookSlug: String(input?.bookSlug ?? "").slice(0, 160),
	claimantName: String(input?.claimantName ?? "").slice(0, 80),
	workReference: String(input?.workReference ?? "").slice(0, 160),
	statement: String(input?.statement ?? "").slice(0, 2e3)
})).handler(fileNotice_createServerFn_handler, async ({ context, data }) => {
	const { fileNotice: run } = await import("./queries.server-BltQr67Z.mjs");
	return run(context.userId, data);
});
var setNoticeStatus_createServerFn_handler = createServerRpc({
	id: "e74fe07803d7ff9503691947eb9f9fd6527937ec09fd0d73ad44d1398446f082",
	name: "setNoticeStatus",
	filename: "src/lib/nebbook/account.functions.ts"
}, (opts) => setNoticeStatus.__executeServer(opts));
var setNoticeStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: String(input?.id ?? "").slice(0, 80),
	status: String(input?.status ?? "").slice(0, 20),
	staffNote: String(input?.staffNote ?? "").slice(0, 2e3)
})).handler(setNoticeStatus_createServerFn_handler, async ({ context, data }) => {
	const { setNoticeStatus: run } = await import("./queries.server-BltQr67Z.mjs");
	return run(context.userId, data);
});
//#endregion
export { assignRole_createServerFn_handler, claimInitialAdmin_createServerFn_handler, createBook_createServerFn_handler, ensureProfile_createServerFn_handler, fileNotice_createServerFn_handler, getAccount_createServerFn_handler, getAdminDesk_createServerFn_handler, getProgress_createServerFn_handler, getViewerBook_createServerFn_handler, listMyBooks_createServerFn_handler, saveProgress_createServerFn_handler, setNoticeStatus_createServerFn_handler, toggleBookmark_createServerFn_handler, transitionBook_createServerFn_handler, updateDraft_createServerFn_handler, updateProfile_createServerFn_handler };
