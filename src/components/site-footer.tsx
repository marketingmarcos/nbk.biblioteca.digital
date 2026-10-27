import { Link } from "@tanstack/react-router";
import { brand } from "@/lib/nebbook/brand";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-medium">{brand.name}</p>
          <p className="mt-1 max-w-sm text-sm text-muted">{brand.tagline} Leitura gratuita, com curadoria antes da publicação.</p>
        </div>
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted" aria-label="Institucional">
          <Link to="/termos" className="min-h-11 inline-flex items-center hover:text-fg">Termos</Link>
          <Link to="/privacidade" className="min-h-11 inline-flex items-center hover:text-fg">Privacidade</Link>
          <Link to="/direitos" search={{ obra: "" }} className="min-h-11 inline-flex items-center hover:text-fg">Direitos autorais</Link>
        </nav>
      </div>
    </footer>
  );
}
