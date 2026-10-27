import { n as unzipSync, t as strFromU8 } from "../_libs/fflate.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/validate-bytes-BFmDtifi.js
var LIMITS = {
	pdf: 8388608,
	epub: 8388608,
	cover: 2097152
};
var COVER_MIMES = [
	"image/jpeg",
	"image/png",
	"image/webp"
];
function validateUpload(input) {
	if (input.kind !== "pdf" && input.kind !== "epub" && input.kind !== "cover") return {
		ok: false,
		error: "Tipo de arquivo não aceito."
	};
	const kind = input.kind;
	if (input.bytes.byteLength === 0) return {
		ok: false,
		error: "O arquivo está vazio."
	};
	if (input.bytes.byteLength > LIMITS[kind]) return {
		ok: false,
		error: `O arquivo passa de ${LIMITS[kind] / 1048576} MB.`
	};
	const detected = detect(input.bytes);
	if (!detected) return {
		ok: false,
		error: "Não foi possível reconhecer o conteúdo do arquivo."
	};
	if (kind === "pdf" && detected.mime !== "application/pdf") return {
		ok: false,
		error: "O conteúdo não é um PDF."
	};
	if (kind === "epub" && detected.mime !== "application/epub+zip") return {
		ok: false,
		error: "O conteúdo não é um EPUB válido."
	};
	if (kind === "cover" && !COVER_MIMES.includes(detected.mime)) return {
		ok: false,
		error: "A capa precisa ser JPEG, PNG ou WebP."
	};
	const declared = input.declaredMime.trim().toLowerCase();
	if (declared && declared !== "application/octet-stream" && declared !== detected.mime && !(kind === "epub" && declared === "application/zip")) return {
		ok: false,
		error: "O tipo informado não confere com o conteúdo."
	};
	const ext = extension(input.filename);
	if (ext && !(kind === "pdf" ? ["pdf"] : kind === "epub" ? ["epub"] : [
		"jpg",
		"jpeg",
		"png",
		"webp"
	]).includes(ext)) return {
		ok: false,
		error: "A extensão não corresponde ao arquivo enviado."
	};
	return {
		ok: true,
		value: detected
	};
}
function extension(filename) {
	const base = filename.split(/[/\\]/).pop() ?? "";
	const dot = base.lastIndexOf(".");
	if (dot <= 0) return "";
	return base.slice(dot + 1).toLowerCase();
}
function detect(bytes) {
	if (isPdf(bytes)) return {
		mime: "application/pdf",
		ext: "pdf"
	};
	if (isPng(bytes)) return {
		mime: "image/png",
		ext: "png"
	};
	if (isJpeg(bytes)) return {
		mime: "image/jpeg",
		ext: "jpg"
	};
	if (isWebp(bytes)) return {
		mime: "image/webp",
		ext: "webp"
	};
	if (isEpub(bytes)) return {
		mime: "application/epub+zip",
		ext: "epub"
	};
	return null;
}
function isPdf(bytes) {
	if (bytes.length < 5) return false;
	if (ascii(bytes.subarray(0, 5)) !== "%PDF-") return false;
	return ascii(bytes.subarray(Math.max(0, bytes.length - 1024))).includes("%%EOF");
}
function isPng(bytes) {
	return bytes.length > 8 && bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71 && bytes[4] === 13 && bytes[5] === 10 && bytes[6] === 26 && bytes[7] === 10;
}
function isJpeg(bytes) {
	return bytes.length > 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
}
function isWebp(bytes) {
	if (bytes.length < 12) return false;
	return ascii(bytes.subarray(0, 4)) === "RIFF" && ascii(bytes.subarray(8, 12)) === "WEBP";
}
function isEpub(bytes) {
	if (bytes.length < 4 || bytes[0] !== 80 || bytes[1] !== 75) return false;
	try {
		const files = unzipSync(bytes);
		const mimeKey = Object.keys(files).find((key) => key.split("/").pop() === "mimetype");
		if (!mimeKey) return false;
		if (strFromU8(files[mimeKey]).replace(/^\uFEFF/, "").trim() !== "application/epub+zip") return false;
		return Object.keys(files).some((key) => key === "META-INF/container.xml" || key.endsWith("/META-INF/container.xml"));
	} catch {
		return false;
	}
}
function ascii(bytes) {
	let out = "";
	for (const byte of bytes) out += String.fromCharCode(byte);
	return out;
}
//#endregion
export { validateUpload };
