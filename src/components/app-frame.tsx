import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function AppFrame({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const reading = path.startsWith("/ler/");
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="starfield" aria-hidden />
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-surface focus:px-3 focus:py-2">
        Ir ao conteúdo
      </a>
      <SiteHeader />
      <div id="conteudo" className="relative z-10 flex-1">{children}</div>
      {reading ? null : <SiteFooter />}
    </div>
  );
}
