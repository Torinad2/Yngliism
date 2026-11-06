import type { ContentItem } from "@/lib/section-content";
import type { Language } from "@/lib/i18n";

import ReactMarkdown from "react-markdown";
import { getCommandmentsIntro } from "@/lib/commandments-intro";

export default function CommandmentsList({
  lang,
  items,
}: {
  lang: Language;
  items: ContentItem[];
}) {
  return (
    <section className="library-section">
      <h2>{lang === "ru" ? "Заповеди Светлых Богов" : "Commandments"}</h2>

      <div className="commandments-list">
        {items.map((item) => (
          <details className="card" key={item.slug}>
            <summary>
              <h3>{item.title}</h3>
            </summary>

            <div className="commandments-content">
              <p style={{ whiteSpace: "pre-line" }}>{item.content}</p>
            </div>
          </details>
        ))}
      </div>

      <div className="commandments-intro">
        <ReactMarkdown skipHtml>{getCommandmentsIntro(lang)}</ReactMarkdown>
      </div>

      {!items.length && (
        <p className="empty">
          {lang === "ru" ? "Заповедей пока нет" : "No commandments yet"}
        </p>
      )}
    </section>
  );
}
