import { createServerFn } from "@tanstack/react-start";

export const listCatalog = createServerFn({ method: "GET" })
  .validator((input: { q?: string; categoria?: string }) => ({
    q: String(input?.q ?? "").slice(0, 80),
    categoria: String(input?.categoria ?? "").slice(0, 40),
  }))
  .handler(async ({ data }) => {
    const { listCatalog: run } = await import("./queries.server");
    return run(data);
  });

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  const { listCategories: run } = await import("./queries.server");
  return run();
});

export const getPublishedBook = createServerFn({ method: "GET" })
  .validator((slug: string) => String(slug ?? "").slice(0, 160))
  .handler(async ({ data }) => {
    const { getPublishedBook: run } = await import("./queries.server");
    return run(data);
  });

export const listAuthors = createServerFn({ method: "GET" }).handler(async () => {
  const { listAuthors: run } = await import("./queries.server");
  return run();
});

export const getAuthor = createServerFn({ method: "GET" })
  .validator((slug: string) => String(slug ?? "").slice(0, 160))
  .handler(async ({ data }) => {
    const { getAuthor: run } = await import("./queries.server");
    return run(data);
  });
