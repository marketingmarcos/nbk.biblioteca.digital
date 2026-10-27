//#region node_modules/.nitro/vite/services/ssr/assets/format-BpaemZ-r.js
function formatDate(value) {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "—";
	return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(date);
}
function formatBytes(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1048576) return `${Math.round(bytes / 1024)} KB`;
	return `${(bytes / 1048576).toFixed(1)} MB`;
}
function shortHash(hash) {
	if (hash.length < 12) return hash;
	return `${hash.slice(0, 8)}…${hash.slice(-6)}`;
}
//#endregion
export { formatDate as n, shortHash as r, formatBytes as t };
