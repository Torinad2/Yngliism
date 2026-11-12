import ReactMarkdown from "react-markdown";

import type { ContentItem } from "@/lib/section-content";
import type { Language } from "@/lib/i18n";

import { getCommandmentsIntro } from "@/lib/commandments-intro";

// RU: Названия и сообщения для поддерживаемых языков.
// EN: Titles and messages for supported languages.
const labels = {
  ru: {
    title: "Заповеди Светлых Богов",
    empty: "Заповедей пока нет",
  },
  en: {
    title: "Commandments of the Light Gods",
    empty: "No commandments yet",
  },
  es: {
    title: "Mandamientos de los Dioses de la Luz",
    empty: "Todavía no hay mandamientos",
  },
} as const;

// RU: Свойства компонента списка заповедей.
// EN: Properties of the commandments list component.
type CommandmentsListProps = {
  lang: Language;
  items: ContentItem[];
};

// RU: Отображаем заповеди и основной текст страницы.
// EN: Render commandments and the main page text.
export default function CommandmentsList({
  lang,
  items,
}: CommandmentsListProps) {
  // RU: Получаем переводы интерфейса.
  // EN: Get localized interface strings.
  const t = labels[lang];

  // RU: Загружаем введение с резервным русским переводом.
  // EN: Load the introduction with Russian fallback.
  const introduction = getCommandmentsIntro(lang);

  return (
    <section className="library-section">
      {/* RU: Основной заголовок страницы. */}
      {/* EN: Main page heading. */}
      <h1>{t.title}</h1>

      {/* RU: Список раскрывающихся заповедей. */}
      {/* EN: List of expandable commandments. */}
      {items.length > 0 ? (
        <div className="commandments-list">
          {items.map((item) => (
            <details className="card" key={item.slug}>
              {/* RU: Заголовок раскрывающегося блока. */}
              {/* EN: Expandable block heading. */}
              <summary>
                <h3>{item.title}</h3>
              </summary>

              {/* RU: Markdown-содержимое заповеди. */}
              {/* EN: Markdown content of the commandment. */}
              <div className="commandments-content">
                <ReactMarkdown skipHtml>{item.content}</ReactMarkdown>
              </div>
            </details>
          ))}
        </div>
      ) : (
        <p className="empty">{t.empty}</p>
      )}

      {/* RU: Введение отображается только при наличии текста. */}
      {/* EN: Display the introduction only when content exists. */}
      {introduction && (
        <div className="commandments-intro">
          <ReactMarkdown skipHtml>{introduction}</ReactMarkdown>
        </div>
      )}
    </section>
  );
}
