import Link from "next/link";

import SiteShell from "./SiteShell";
import CommandmentsList from "./CommandmentsList";

import { copy, sectionUrl, type Language, type Section } from "@/lib/i18n";

import { getSectionContent } from "@/lib/section-content";

// RU: Компонент отображает главную страницу или заповеди.
// EN: Component renders the home page or commandments.
export default function SectionPage({
  lang,
  section,
}: {
  lang: Language;
  section: Section;
}) {
  // RU: Получаем переводы интерфейса.
  // EN: Get localized interface strings.
  const t = copy[lang];

  // RU: Заголовок главной страницы на выбранном языке.
  // EN: Localized home page heading.
  const headings = {
    ru: {
      first: "Пространство",
      second: "для понимания.",
    },
    en: {
      first: "A space for",
      second: "understanding.",
    },
    es: {
      first: "Un espacio para",
      second: "comprender.",
    },
  };

  // RU: Описание декоративной иллюстрации.
  // EN: Accessible description of the decorative illustration.
  const artLabels = {
    ru: "Древнерусская деревня, деревянные дома и солнце",
    en: "Ancient Russian village, wooden houses and sun",
    es: "Antigua aldea rusa, casas de madera y sol",
  };

  return (
    <SiteShell lang={lang} active={section}>
      {/* RU: Главная страница. */}
      {/* EN: Home page. */}
      {section === "home" && (
        <section className="hero">
          <div>
            <div className="eyebrow">{t.eye}</div>

            <h1>
              {headings[lang].first}
              <br />
              <em>{headings[lang].second}</em>
            </h1>

            <p className="intro">{t.intro}</p>

            {/* RU: Кнопка перехода к заповедям. */}
            {/* EN: Button linking to the commandments. */}
            <Link className="primary" href={sectionUrl(lang, "commandments")}>
              {t.nav[1]} ↗
            </Link>
          </div>

          {/* RU: Сохраняем существующую CSS-иллюстрацию. */}
          {/* EN: Preserve the existing CSS illustration. */}
          <div className="art" role="img" aria-label={artLabels[lang]} />
        </section>
      )}

      {/* RU: Страница заповедей с раскрывающимися блоками. */}
      {/* EN: Commandments page with expandable sections. */}
      {section === "commandments" && (
        <CommandmentsList
          lang={lang}
          items={getSectionContent("commandments", lang)}
        />
      )}
    </SiteShell>
  );
}
