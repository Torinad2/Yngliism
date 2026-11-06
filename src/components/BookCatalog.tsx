import type { ContentItem } from "@/lib/section-content";
import type { Language } from "@/lib/i18n";

export default function BookCatalog({
  lang,
  items,
}: {
  lang: Language;
  items: ContentItem[];
}) {
  return (
    <section className="library-section">
      <h2>{lang === "ru" ? "Библиотека" : "Library"}</h2>

      <div className="grid">
        {items.map((book) => (
          <article className="card" key={book.slug}>
            <h3>{book.title}</h3>

            {book.author && <div className="eyebrow">{book.author}</div>}

            <p>{book.description}</p>

            {book.source_url && (
              <a
                className="read"
                href={book.source_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {lang === "ru" ? "Открыть книгу" : "Open book"}
              </a>
            )}
          </article>
        ))}
      </div>

      {!items.length && (
        <p className="empty">
          {lang === "ru" ? "Книг пока нет" : "No books yet"}
        </p>
      )}
    </section>
  );
}
