import { r as getBearerToken } from "./client-CwpVfGGi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/transfer-CfoO3VWq.js
function authHeaders() {
	const headers = new Headers();
	const token = getBearerToken();
	if (token) headers.set("Authorization", `Bearer ${token}`);
	return headers;
}
async function fetchBookFile(id, download = false) {
	const response = await fetch(`/api/files/${encodeURIComponent(id)}${download ? "?download=1" : ""}`, {
		headers: authHeaders(),
		credentials: "same-origin"
	});
	if (!response.ok) throw new Error(await response.text() || "Arquivo indisponível.");
	return {
		buffer: await response.arrayBuffer(),
		mime: response.headers.get("content-type") || "application/octet-stream"
	};
}
async function uploadBookFile(bookId, kind, file) {
	const body = new FormData();
	body.set("bookId", bookId);
	body.set("kind", kind);
	body.set("file", file);
	const response = await fetch("/api/uploads", {
		method: "POST",
		body,
		headers: authHeaders(),
		credentials: "same-origin"
	});
	const payload = await response.json().catch(() => ({}));
	if (!response.ok) throw new Error(payload.error || "Falha no envio.");
	return payload;
}
async function saveBlob(buffer, mime, filename) {
	const url = URL.createObjectURL(new Blob([buffer], { type: mime }));
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}
//#endregion
export { saveBlob as n, uploadBookFile as r, fetchBookFile as t };
