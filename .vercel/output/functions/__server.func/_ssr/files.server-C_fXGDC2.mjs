//#region node_modules/.nitro/vite/services/ssr/assets/files.server-C_fXGDC2.js
function bytesFromDb(value) {
	if (value instanceof Uint8Array) return value;
	if (typeof Buffer !== "undefined" && Buffer.isBuffer(value)) return new Uint8Array(value);
	if (value instanceof ArrayBuffer) return new Uint8Array(value);
	if (typeof value === "string") {
		if (value.startsWith("\\x")) {
			const hex = value.slice(2);
			const out = new Uint8Array(hex.length / 2);
			for (let i = 0; i < out.length; i += 1) out[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
			return out;
		}
		const asBase64 = Buffer.from(value, "base64");
		if (asBase64.length) return new Uint8Array(asBase64);
	}
	throw new Error("Arquivo ilegível.");
}
function fileAccess(input) {
	const isOwner = Boolean(input.userId && input.ownerUserId === input.userId);
	const staff = input.role === "editor" || input.role === "admin";
	const published = input.status === "published";
	if (!published && !isOwner && !staff) return {
		ok: false,
		status: 404,
		error: "Não encontrado."
	};
	if (input.download && (!input.allowDownload || !published)) return {
		ok: false,
		status: 403,
		error: "O download não está autorizado para esta obra."
	};
	return { ok: true };
}
function safeFilename(name, ext) {
	return `${(name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^\.+/, "").slice(0, 80) || "arquivo").replace(/\.[^.]+$/, "")}.${ext}`;
}
var hits = /* @__PURE__ */ new Map();
function allowUploadRate(userId) {
	const now = Date.now();
	const recent = (hits.get(userId) ?? []).filter((stamp) => now - stamp < 36e5);
	if (recent.length >= 20) {
		hits.set(userId, recent);
		return false;
	}
	recent.push(now);
	hits.set(userId, recent);
	return true;
}
//#endregion
export { allowUploadRate, bytesFromDb, fileAccess, safeFilename };
