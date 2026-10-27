import { Link } from "@tanstack/react-router";
import { Cover } from "@/components/cover";
import { Badge } from "@/components/ui/badge";
import type { BookCard as Card } from "@/lib/nebbook/types";

export function BookCard({ book }: { book: Card }) {
  const category = book.categories[0]?.name;
  return (
    <Link
      to="/livros/$slug"
      params={{ slug: book.slug }}
      className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
    >
      <Cover title={book.title} seed={book.slug} category={category} imageUrl={book.coverUrl} className="transition-transform duration-200 ease-out group-hover:-translate-y-0.5" />
      <div className="mt-3 space-y-1">
        <p className="line-clamp-1 text-sm text-muted">{book.authors.map((author) => author.name).join(", ") || "Autor não informado"}</p>
        {book.isDemonstrative ? <Badge>Demonstração</Badge> : null}
      </div>
    </Link>
  );
}
