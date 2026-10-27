import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { brand } from "@/lib/nebbook/brand";
import { cn } from "@/lib/cn";

const LINKS = [
  { to: "/catalogo", label: "Catálogo" },
  { to: "/autores", label: "Autores" },
  { to: "/enviar", label: "Enviar obra" },
] as const;

export function SiteHeader() {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const { user, isPending } = useCurrentUserState();
  const [open, setOpen] = useState(false);
  const reading = path.startsWith("/ler/");

  useEffect(() => {
    setOpen(false);
  }, [path]);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex min-h-11 items-center gap-2 font-medium tracking-tight">
          <img src="/favicon.svg" alt="" className="size-8" />
          <span>{brand.name}</span>
        </Link>
        {!reading ? (
          <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Principal">
            {LINKS.map((link) => {
              const active = path === link.to || path.startsWith(`${link.to}/`);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  search={link.to === "/catalogo" ? { q: "", categoria: "" } : undefined}
                  className={cn("inline-flex min-h-11 items-center px-3 text-sm", active ? "text-fg" : "text-muted")}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        ) : null}
        <div className="ml-auto flex items-center gap-2">
          {isPending ? <div className="h-8 w-24 animate-pulse rounded-full bg-surface" /> : null}
          {!isPending && user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <Link to="/conta" className="text-sm text-muted hover:text-fg">Conta</Link>
              <UserButton />
            </div>
          ) : null}
          {!isPending && !user ? (
            <Link to="/login" className="hidden min-h-11 items-center px-3 text-sm sm:inline-flex">
              Entrar
            </Link>
          ) : null}
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-line md:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </div>
      {open ? (
        <nav id="menu-mobile" className="border-t border-line px-4 py-2 md:hidden" aria-label="Mobile">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              search={link.to === "/catalogo" ? { q: "", categoria: "" } : undefined}
              className="flex min-h-11 items-center text-sm"
            >
              {link.label}
            </Link>
          ))}
          <Link to="/conta" className="flex min-h-11 items-center text-sm">Conta</Link>
          {!user ? <Link to="/login" className="flex min-h-11 items-center text-sm">Entrar</Link> : null}
        </nav>
      ) : null}
    </header>
  );
}
