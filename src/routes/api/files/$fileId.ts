import { createFileRoute } from "@tanstack/react-router";

function sameOrigin(request: Request): boolean {
  const site = request.headers.get("sec-fetch-site");
  if (!site || site === "same-origin" || site === "none") return true;
  const dest = request.headers.get("sec-fetch-dest");
  return (
    request.headers.get("sec-fetch-mode") === "navigate" &&
    request.method === "GET" &&
    dest !== "object" &&
    dest !== "embed"
  );
}

export const Route = createFileRoute("/api/files/$fileId")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        if (!sameOrigin(request)) return new Response("Origem não permitida.", { status: 403 });
        const id = params.fileId;
        if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id)) return new Response("Não encontrado.", { status: 404 });
        const url = new URL(request.url);
        const download = url.searchParams.get("download") === "1";
        const { getSessionUser } = await import("@/lib/auth/verify.server");
        const header = request.headers.get("authorization") || "";
        const token = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : undefined;
        const user = await getSessionUser(token);
        const { loadFile, roleFor } = await import("@/lib/nebbook/queries.server");
        const { bytesFromDb, fileAccess, safeFilename } = await import("@/lib/nebbook/files.server");
        const row = await loadFile(id);
        if (!row) return new Response("Não encontrado.", { status: 404 });
        const role = user ? await roleFor(user.id) : null;
        const access = fileAccess({
          status: row.status,
          allowDownload: Boolean(row.allow_download),
          ownerUserId: row.owner_user_id,
          userId: user?.id ?? null,
          role,
          download,
        });
        if (!access.ok) return new Response(access.error, { status: access.status });
        const bytes = bytesFromDb(row.content);
        const ext = row.kind === "pdf" ? "pdf" : row.kind === "epub" ? "epub" : row.mime === "image/png" ? "png" : row.mime === "image/webp" ? "webp" : "jpg";
        const filename = safeFilename(row.original_name, ext);
        const publishedCover = row.status === "published" && row.kind === "cover" && !download;
        return new Response(Buffer.from(bytes), {
          headers: {
            "content-type": row.mime,
            "content-length": String(bytes.byteLength),
            "content-disposition": `${download ? "attachment" : "inline"}; filename="${filename}"`,
            "x-content-type-options": "nosniff",
            "cache-control": publishedCover ? "public, max-age=3600" : "private, no-store",
            "x-robots-tag": "noindex",
          },
        });
      },
    },
  },
});
