import type { Metadata } from "next";

import { languages, type Language, type Section } from "./i18n";

// RU: Основной адрес сайта.
// EN: Main website URL.
export const siteUrl = "https://yngliism.com";

// RU: Названия доступных разделов на всех языках.
// EN: Names of available sections in all languages.
export const sectionNames: Record<Language, Record<Section, string>> = {
  ru: {
    home: "Главная",
    commandments: "Заповеди",
  },

  en: {
    home: "Home",
    commandments: "Commandments",
  },

  es: {
    home: "Inicio",
    commandments: "Mandamientos",
  },
};

// RU: Формируем URL раздела на выбранном языке.
// EN: Generate a localized section URL.
export function sectionPath(lang: Language, section: Section): string {
  return `/${lang}/${section === "home" ? "" : `${section}/`}`;
}

// RU: Генерируем SEO-метаданные для страницы.
// EN: Generate SEO metadata for a page.
export function localizedMetadata(lang: Language, section: Section): Metadata {
  // RU: Получаем путь и заголовок текущей страницы.
  // EN: Get the current page path and title.
  const pagePath = sectionPath(lang, section);
  const title = sectionNames[lang][section];

  // RU: Формируем описание на выбранном языке.
  // EN: Generate a description in the selected language.
  const description =
    lang === "ru"
      ? `Yngliism — ${title.toLowerCase()}. Материалы, знания и источники.`
      : lang === "es"
        ? `Yngliism — ${title}. Materiales, conocimientos y fuentes.`
        : `Yngliism — ${title}. Materials, knowledge, and sources.`;

  // RU: Настройки языка для Open Graph.
  // EN: Language locale settings for Open Graph.
  const locale = lang === "ru" ? "ru_RU" : lang === "es" ? "es_ES" : "en_US";

  return {
    title,
    description,

    // RU: Канонический адрес и языковые альтернативы.
    // EN: Canonical URL and language alternatives.
    alternates: {
      canonical: pagePath,

      languages: Object.fromEntries(
        languages.map((language) => [language, sectionPath(language, section)]),
      ),
    },

    // RU: Метаданные для отображения ссылок в социальных сетях.
    // EN: Metadata for social media link previews.
    openGraph: {
      title: `${title} · Yngliism`,
      description,
      url: pagePath,
      siteName: "Yngliism",
      locale,
      type: "website",
    },
  };
}
