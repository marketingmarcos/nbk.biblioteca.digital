import { r as createServerFn } from "./ssr.mjs";
import { d as createSsrRpc } from "./router-K_C10-Xj.mjs";
import { t as authMiddleware } from "./middleware-D-peLKt5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account.functions-BMweADLa.js
var ensureProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ intent: input?.intent === "author" ? "author" : "reader" })).handler(createSsrRpc("a6efff1139163054d67ffa8270a180cae6dd14580fe6965107cbbd110b7b0474"));
var getAccount = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("d65fa36b3b94b84879e12b3225fdb42b158d57c4e170dd208a22fba6505ee20c"));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	displayName: String(input?.displayName ?? "").slice(0, 80),
	bio: String(input?.bio ?? "").slice(0, 600)
})).handler(createSsrRpc("eae48d06d9afffc6174b2f5281497bb17fd3aed55f03300b30c0452e17fd5347"));
var listMyBooks = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("d95a98af4ab77726175efb56d614c41ef5cdadbe259f1ab43664a1e6e4c2a51a"));
var createBook = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("045b9eaddac11b6e520e963d4a34a2da6339e26ad8111a089edc4795d71860ba"));
var updateDraft = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	bookId: String(input?.bookId ?? ""),
	title: String(input?.title ?? ""),
	synopsis: String(input?.synopsis ?? ""),
	allowDownload: Boolean(input?.allowDownload)
})).handler(createSsrRpc("cb4e8893207e05c353134eef003d7943c08c7361771f3926ac123afc47567e4a"));
var transitionBook = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	bookId: String(input?.bookId ?? ""),
	to: String(input?.to ?? ""),
	note: String(input?.note ?? "").slice(0, 2e3)
})).handler(createSsrRpc("7ee91a2fad42837a36fdb4d84eed0cc85ed81968aa4689dc3d3231f5466c529c"));
var saveProgress = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	slug: String(input?.slug ?? ""),
	locator: String(input?.locator ?? ""),
	progressPct: Number(input?.progressPct ?? 0)
})).handler(createSsrRpc("7ab53117f1333ed6b3bd0c13f500c36ea3625832cd6d4691b6869b04ddc23751"));
var getProgress = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((slug) => String(slug ?? "")).handler(createSsrRpc("a87be8b410d495a29995f9d2f0f88e9e64f0cf5102a637437d766602397b9da9"));
var toggleBookmark = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	slug: String(input?.slug ?? ""),
	locator: String(input?.locator ?? ""),
	note: String(input?.note ?? "")
})).handler(createSsrRpc("5252536bfd33a9917503384fbcf5fc1d280a360f591fe30c997e64e9d066ad3b"));
var getViewerBook = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((slug) => String(slug ?? "")).handler(createSsrRpc("ff9ba8790653ba12901e98349940fc7ed894256b378d1bd6a104451dde2de769"));
var getAdminDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("fbe9eed1755616be4cee090501ac9319ac8ffb9d998f82c90c66810437940ccf"));
var claimInitialAdmin = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("cae1b3990883c44bc825b1203d90454f0b0ce14106418613d29c4daa451a05b7"));
var assignRole = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	userId: String(input?.userId ?? ""),
	role: String(input?.role ?? "")
})).handler(createSsrRpc("b3528485bef1445760cf10c3fd6541b26409293ff9a9bb3cc94f7d94922895ca"));
var fileNotice = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	bookSlug: String(input?.bookSlug ?? "").slice(0, 160),
	claimantName: String(input?.claimantName ?? "").slice(0, 80),
	workReference: String(input?.workReference ?? "").slice(0, 160),
	statement: String(input?.statement ?? "").slice(0, 2e3)
})).handler(createSsrRpc("13b19e0984e4989f4f40c1428f60a362bb73d5e048259e1f1a8746071a268ed3"));
var setNoticeStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	id: String(input?.id ?? "").slice(0, 80),
	status: String(input?.status ?? "").slice(0, 20),
	staffNote: String(input?.staffNote ?? "").slice(0, 2e3)
})).handler(createSsrRpc("e74fe07803d7ff9503691947eb9f9fd6527937ec09fd0d73ad44d1398446f082"));
//#endregion
export { fileNotice as a, getProgress as c, saveProgress as d, setNoticeStatus as f, updateProfile as g, updateDraft as h, ensureProfile as i, getViewerBook as l, transitionBook as m, claimInitialAdmin as n, getAccount as o, toggleBookmark as p, createBook as r, getAdminDesk as s, assignRole as t, listMyBooks as u };
