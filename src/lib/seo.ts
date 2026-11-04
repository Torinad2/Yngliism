import type { Metadata } from "next";
import { getArticles } from "./articles";
import { languages, routes, type Language, type Section } from "./i18n";

export const siteUrl = "https://yngliism.com";
export const sectionNames: Record<Language, Record<Section, string>> = {
  ru: { home: "Главная", teachings: "Учение", articles: "Статьи", timeline: "История", about: "О проекте" },
  en: { home: "Home", teachings: "Teachings", articles: "Articles", timeline: "History", about: "About" },
};
export function sectionPath(lang: Language, section: Section) {
  return `/${lang}/${section === "home" ? "" : `${section}/`}`;
}
export function localizedMetadata(lang: Language, section: Section): Metadata {
  const path = sectionPath(lang, section);
  const title = sectionNames[lang][section];
  const description = lang === "ru"
    ? `Yngliism — ${title.toLowerCase()}. Открытая библиотека статей и источников.`
    : `Yngliism — ${title}. An open library of articles and sources.`;
  return {
    title, description,
    alternates: { canonical: path, languages: Object.fromEntries(languages.map(l => [l, sectionPath(l, section)])) },
    openGraph: { title: `${title} · Yngliism`, description, url: path, siteName: "Yngliism", locale: lang === "ru" ? "ru_RU" : "en_US", type: "website" },
  };
}
export function articleAlternates(slug: string) {
  return Object.fromEntries(languages.filter(lang => getArticles(lang).some(a => a.slug === slug)).map(lang => [lang, `/${lang}/article/${slug}/`]));
}
