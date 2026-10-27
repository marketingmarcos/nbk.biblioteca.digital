import { strFromU8, unzipSync } from "fflate";

export const LIMITS = {
  pdf: 8 * 1024 * 1024,
  epub: 8 * 1024 * 1024,
  cover: 2 * 1024 * 1024,
} as const;

export type UploadKind = keyof typeof LIMITS;

const COVER_MIMES = ["image/jpeg", "image/png", "image/webp"] as const;

export type ValidUpload = { mime: string; ext: string };

export function validateUpload(input: {
  kind: string;
  bytes: Uint8Array;
  declaredMime: string;
  filename: string;
}): { ok: true; value: ValidUpload } | { ok: false; error: string } {
  if (input.kind !== "pdf" && input.kind !== "epub" && input.kind !== "cover") {
    return { ok: false, error: "Tipo de arquivo não aceito." };
  }
  const kind = input.kind;
  if (input.bytes.byteLength === 0) {
    return { ok: false, error: "O arquivo está vazio." };
  }
  if (input.bytes.byteLength > LIMITS[kind]) {
    const mb = LIMITS[kind] / (1024 * 1024);
    return { ok: false, error: `O arquivo passa de ${mb} MB.` };
  }

  const detected = detect(input.bytes);
  if (!detected) {
    return { ok: false, error: "Não foi possível reconhecer o conteúdo do arquivo." };
  }

  if (kind === "pdf" && detected.mime !== "application/pdf") {
    return { ok: false, error: "O conteúdo não é um PDF." };
  }
  if (kind === "epub" && detected.mime !== "application/epub+zip") {
    return { ok: false, error: "O conteúdo não é um EPUB válido." };
  }
  if (kind === "cover" && !COVER_MIMES.includes(detected.mime as (typeof COVER_MIMES)[number])) {
    return { ok: false, error: "A capa precisa ser JPEG, PNG ou WebP." };
  }

  const declared = input.declaredMime.trim().toLowerCase();
  if (
    declared &&
    declared !== "application/octet-stream" &&
    declared !== detected.mime &&
    !(kind === "epub" && declared === "application/zip")
  ) {
    return { ok: false, error: "O tipo informado não confere com o conteúdo." };
  }

  const ext = extension(input.filename);
  const allowed = kind === "pdf" ? ["pdf"] : kind === "epub" ? ["epub"] : ["jpg", "jpeg", "png", "webp"];
  if (ext && !allowed.includes(ext)) {
    return { ok: false, error: "A extensão não corresponde ao arquivo enviado." };
  }

  return { ok: true, value: detected };
}

function extension(filename: string): string {
  const base = filename.split(/[/\\]/).pop() ?? "";
  const dot = base.lastIndexOf(".");
  if (dot <= 0) return "";
  return base.slice(dot + 1).toLowerCase();
}

function detect(bytes: Uint8Array): ValidUpload | null {
  if (isPdf(bytes)) return { mime: "application/pdf", ext: "pdf" };
  if (isPng(bytes)) return { mime: "image/png", ext: "png" };
  if (isJpeg(bytes)) return { mime: "image/jpeg", ext: "jpg" };
  if (isWebp(bytes)) return { mime: "image/webp", ext: "webp" };
  if (isEpub(bytes)) return { mime: "application/epub+zip", ext: "epub" };
  return null;
}

function isPdf(bytes: Uint8Array): boolean {
  if (bytes.length < 5) return false;
  const head = ascii(bytes.subarray(0, 5));
  if (head !== "%PDF-") return false;
  const tail = ascii(bytes.subarray(Math.max(0, bytes.length - 1024)));
  return tail.includes("%%EOF");
}

function isPng(bytes: Uint8Array): boolean {
  return (
    bytes.length > 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  );
}

function isJpeg(bytes: Uint8Array): boolean {
  return bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
}

function isWebp(bytes: Uint8Array): boolean {
  if (bytes.length < 12) return false;
  return ascii(bytes.subarray(0, 4)) === "RIFF" && ascii(bytes.subarray(8, 12)) === "WEBP";
}

function isEpub(bytes: Uint8Array): boolean {
  if (bytes.length < 4 || bytes[0] !== 0x50 || bytes[1] !== 0x4b) return false;
  try {
    const files = unzipSync(bytes);
    const mimeKey = Object.keys(files).find((key) => key.split("/").pop() === "mimetype");
    if (!mimeKey) return false;
    if (strFromU8(files[mimeKey]).replace(/^\uFEFF/, "").trim() !== "application/epub+zip") {
      return false;
    }
    return Object.keys(files).some(
      (key) => key === "META-INF/container.xml" || key.endsWith("/META-INF/container.xml"),
    );
  } catch {
    return false;
  }
}

function ascii(bytes: Uint8Array): string {
  let out = "";
  for (const byte of bytes) out += String.fromCharCode(byte);
  return out;
}
