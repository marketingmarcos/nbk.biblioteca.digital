import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import type { CreateBookInput } from "./types";

export const ensureProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { intent?: string }) => ({
    intent: input?.intent === "author" ? ("author" as const) : ("reader" as const),
  }))
  .handler(async ({ context, data }) => {
    const { ensureProfile: run } = await import("./queries.server");
    const role = await run(context.userId, data.intent);
    return { role };
  });

export const getAccount = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { getAccount: run } = await import("./queries.server");
    return run(context.userId);
  });

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { displayName?: string; bio?: string }) => ({
    displayName: String(input?.displayName ?? "").slice(0, 80),
    bio: String(input?.bio ?? "").slice(0, 600),
  }))
  .handler(async ({ context, data }) => {
    const { updateProfile: run } = await import("./queries.server");
    return run(context.userId, data.displayName, data.bio);
  });

export const listMyBooks = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { listMyBooks: run } = await import("./queries.server");
    return run(context.userId);
  });

export const createBook = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: CreateBookInput) => input)
  .handler(async ({ context, data }) => {
    const { createBook: run } = await import("./queries.server");
    return run(context.userId, {
      title: String(data?.title ?? ""),
      synopsis: String(data?.synopsis ?? ""),
      categorySlug: String(data?.categorySlug ?? ""),
      allowDownload: Boolean(data?.allowDownload),
      rightsHolder: String(data?.rightsHolder ?? ""),
      rightsStatement: String(data?.rightsStatement ?? ""),
      rightsConfirmed: data?.rightsConfirmed === true,
    });
  });

export const updateDraft = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { bookId?: string; title?: string; synopsis?: string; allowDownload?: boolean }) => ({
    bookId: String(input?.bookId ?? ""),
    title: String(input?.title ?? ""),
    synopsis: String(input?.synopsis ?? ""),
    allowDownload: Boolean(input?.allowDownload),
  }))
  .handler(async ({ context, data }) => {
    const { updateDraft: run } = await import("./queries.server");
    return run(context.userId, data);
  });

export const transitionBook = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { bookId?: string; to?: string; note?: string }) => ({
    bookId: String(input?.bookId ?? ""),
    to: String(input?.to ?? ""),
    note: String(input?.note ?? "").slice(0, 2000),
  }))
  .handler(async ({ context, data }) => {
    const { transitionBook: run } = await import("./queries.server");
    return run(context.userId, data);
  });

export const saveProgress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { slug?: string; locator?: string; progressPct?: number }) => ({
    slug: String(input?.slug ?? ""),
    locator: String(input?.locator ?? ""),
    progressPct: Number(input?.progressPct ?? 0),
  }))
  .handler(async ({ context, data }) => {
    const { saveProgress: run } = await import("./queries.server");
    return run(context.userId, data);
  });

export const getProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((slug: string) => String(slug ?? ""))
  .handler(async ({ context, data }) => {
    const { getProgress: run } = await import("./queries.server");
    return run(context.userId, data);
  });

export const toggleBookmark = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { slug?: string; locator?: string; note?: string }) => ({
    slug: String(input?.slug ?? ""),
    locator: String(input?.locator ?? ""),
    note: String(input?.note ?? ""),
  }))
  .handler(async ({ context, data }) => {
    const { toggleBookmark: run } = await import("./queries.server");
    return run(context.userId, data);
  });

export const getViewerBook = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((slug: string) => String(slug ?? ""))
  .handler(async ({ context, data }) => {
    const { getViewerBook: run } = await import("./queries.server");
    return run(context.userId, data);
  });

export const getAdminDesk = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { getAdminDesk: run } = await import("./queries.server");
    return run(context.userId);
  });

export const claimInitialAdmin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { claimInitialAdmin: run } = await import("./queries.server");
    return run(context.userId);
  });

export const assignRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { userId?: string; role?: string }) => ({
    userId: String(input?.userId ?? ""),
    role: String(input?.role ?? ""),
  }))
  .handler(async ({ context, data }) => {
    const { assignRole: run } = await import("./queries.server");
    return run(context.userId, data.userId, data.role);
  });

export const fileNotice = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { bookSlug?: string; claimantName?: string; workReference?: string; statement?: string }) => ({
    bookSlug: String(input?.bookSlug ?? "").slice(0, 160),
    claimantName: String(input?.claimantName ?? "").slice(0, 80),
    workReference: String(input?.workReference ?? "").slice(0, 160),
    statement: String(input?.statement ?? "").slice(0, 2000),
  }))
  .handler(async ({ context, data }) => {
    const { fileNotice: run } = await import("./queries.server");
    return run(context.userId, data);
  });

export const setNoticeStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id?: string; status?: string; staffNote?: string }) => ({
    id: String(input?.id ?? "").slice(0, 80),
    status: String(input?.status ?? "").slice(0, 20),
    staffNote: String(input?.staffNote ?? "").slice(0, 2000),
  }))
  .handler(async ({ context, data }) => {
    const { setNoticeStatus: run } = await import("./queries.server");
    return run(context.userId, data);
  });
