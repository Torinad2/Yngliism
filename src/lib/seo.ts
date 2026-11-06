import type { Metadata } from "next";
import { getArticles } from "./articles";
import { languages, type Language, type Section } from "./i18n";

export const siteUrl = "https://yngliism.com";

export const sectionNames: Record<Language, Record<Section, string>> = {
  ru: {
    home: "Главная",
    teachings: "Учение",
    commandments: "Заповеди",
    articles: "Статьи",
    library: "Библиотека",
    timeline: "История",
    about: "О проекте",
  },
  en: {
    home: "Home",
    teachings: "Teachings",
    commandments: "Commandments",
    articles: "Articles",
    library: "Library",
    timeline: "History",
    about: "About",
  },
};

export function sectionPath(lang: Language, section: Section) {
  return `/${lang}/${section === "home" ? "" : `${section}/`}`;
}

export function localizedMetadata(lang: Language, section: Section): Metadata {
  const path = sectionPath(lang, section);
  const title = sectionNames[lang][section];

  const description =
    lang === "ru"
      ? `Yngliism — ${title.toLowerCase()}. Материалы, знания и источники.`
      : `Yngliism — ${title}. Materials, knowledge, and sources.`;

  return {
    title,
    description,

    alternates: {
      canonical: path,
      languages: Object.fromEntries(
        languages.map((l) => [l, sectionPath(l, section)]),
      ),
    },

    openGraph: {
      title: `${title} · Yngliism`,
      description,
      url: path,
      siteName: "Yngliism",
      locale: lang === "ru" ? "ru_RU" : "en_US",
      type: "website",
    },
  };
}

export function articleAlternates(slug: string) {
  return Object.fromEntries(
    languages
      .filter((lang) =>
        getArticles(lang).some((article) => article.slug === slug),
      )
      .map((lang) => [lang, `/${lang}/article/${slug}/`]),
  );
}
