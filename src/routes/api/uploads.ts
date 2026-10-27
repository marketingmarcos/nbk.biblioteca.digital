import { createFileRoute } from "@tanstack/react-router";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function sameOrigin(request: Request): boolean {
  const site = request.headers.get("sec-fetch-site");
  if (!site || site === "same-origin" || site === "none") return true;
  return false;
}

export const Route = createFileRoute("/api/uploads")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          if (!sameOrigin(request)) return json({ error: "Origem não permitida." }, 403);
          const length = Number(request.headers.get("content-length") || 0);
          if (length > 9 * 1024 * 1024) return json({ error: "Arquivo acima do limite." }, 413);
          const { getSessionUser } = await import("@/lib/auth/verify.server");
          const header = request.headers.get("authorization") || "";
          const token = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : undefined;
          const user = await getSessionUser(token);
          if (!user) return json({ error: "É preciso entrar para enviar um arquivo." }, 401);
          const { allowUploadRate } = await import("@/lib/nebbook/files.server");
          if (!allowUploadRate(user.id)) {
            return json({ error: "Limite de envios desta hora atingido." }, 429);
          }
          const form = await request.formData();
          const bookId = String(form.get("bookId") || "");
          const kind = String(form.get("kind") || "");
          const file = form.get("file");
          if (!/^[a-zA-Z0-9_-]{1,80}$/.test(bookId)) return json({ error: "Obra inválida." }, 400);
          if (kind !== "pdf" && kind !== "epub" && kind !== "cover") {
            return json({ error: "Tipo de arquivo não aceito." }, 400);
          }
          if (!(file instanceof File)) return json({ error: "Arquivo ausente." }, 400);
          const bytes = new Uint8Array(await file.arrayBuffer());
          const { validateUpload } = await import("@/lib/nebbook/validate-bytes");
          const checked = validateUpload({
            kind,
            bytes,
            declaredMime: file.type || "",
            filename: file.name || "",
          });
          if (!checked.ok) return json({ error: checked.error }, 400);
          const { assertUpload, storeFile } = await import("@/lib/nebbook/queries.server");
          const gate = await assertUpload(user.id, bookId, kind);
          const digest = await crypto.subtle.digest("SHA-256", new Uint8Array(bytes));
          const sha256 = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
          const stored = await storeFile({
            userId: user.id,
            bookId,
            kind,
            mime: checked.value.mime,
            bytes,
            sha256,
            originalName: file.name || `arquivo.${checked.value.ext}`,
            bucket: gate.bucket,
          });
          return json(stored);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Falha no envio.";
          const status = typeof error === "object" && error && "status" in error ? Number(error.status) : 400;
          return json({ error: message }, Number.isFinite(status) ? status : 400);
        }
      },
    },
  },
});
