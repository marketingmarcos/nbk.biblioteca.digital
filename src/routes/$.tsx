import { createFileRoute } from "@tanstack/react-router";
import { AppFrame } from "@/components/app-frame";
import { NotFoundState } from "@/components/states";

export const Route = createFileRoute("/$")({
  head: () => ({ meta: [{ title: "Página não encontrada · Nebbook" }] }),
  component: () => (
    <AppFrame>
      <main className="mx-auto max-w-3xl px-4 py-16">
        <NotFoundState />
      </main>
    </AppFrame>
  ),
});
