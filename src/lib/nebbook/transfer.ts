import { getBearerToken } from "@/lib/auth/client";

function authHeaders() {
  const headers = new Headers();
  const token = getBearerToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
}

export async function fetchBookFile(id: string, download = false) {
  const response = await fetch(`/api/files/${encodeURIComponent(id)}${download ? "?download=1" : ""}`, {
    headers: authHeaders(),
    credentials: "same-origin",
  });
  if (!response.ok) throw new Error((await response.text()) || "Arquivo indisponível.");
  return {
    buffer: await response.arrayBuffer(),
    mime: response.headers.get("content-type") || "application/octet-stream",
  };
}

export async function uploadBookFile(bookId: string, kind: "pdf" | "epub" | "cover", file: File) {
  const body = new FormData();
  body.set("bookId", bookId);
  body.set("kind", kind);
  body.set("file", file);
  const response = await fetch("/api/uploads", {
    method: "POST",
    body,
    headers: authHeaders(),
    credentials: "same-origin",
  });
  const payload = (await response.json().catch(() => ({}))) as { error?: string; id?: string; sha256?: string };
  if (!response.ok) throw new Error(payload.error || "Falha no envio.");
  return payload;
}

export async function saveBlob(buffer: ArrayBuffer, mime: string, filename: string) {
  const url = URL.createObjectURL(new Blob([buffer], { type: mime }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
