import type { Metadata } from "next";
import { notFound } from "next/navigation";

import SectionPage from "@/components/SectionPage";

import { languages, type Language } from "@/lib/i18n";

import { localizedMetadata } from "@/lib/seo";

// RU: Единственный дополнительный раздел сайта — Заповеди.
// EN: The only additional website section is Commandments.
const sections = ["commandments"] as const;

// RU: Тип доступного раздела.
// EN: Type of the available section.
type AvailableSection = (typeof sections)[number];

// RU: Параметры динамического маршрута.
// EN: Dynamic route parameters.
type RouteParams = {
  lang: Language;
  section: string;
};

// RU: Генерируем статические страницы для всех языков.
// EN: Generate static pages for all supported languages.
export function generateStaticParams() {
  return languages.flatMap((lang) =>
    sections.map((section) => ({
      lang,
      section,
    })),
  );
}

// RU: Проверяем, поддерживается ли запрошенный раздел.
// EN: Check whether the requested section is supported.
function isAvailableSection(section: string): section is AvailableSection {
  return sections.some((value) => value === section);
}

// RU: Формируем SEO-метаданные для страницы Заповедей.
// EN: Generate SEO metadata for the Commandments page.
export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { lang, section } = await params;

  // RU: Проверяем язык и раздел.
  // EN: Validate the language and section.
  if (!languages.includes(lang) || !isAvailableSection(section)) {
    return {};
  }

  return localizedMetadata(lang, section);
}

// RU: Отображаем страницу выбранного раздела.
// EN: Render the requested section page.
export default async function SectionRoute({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { lang, section } = await params;

  // RU: Для неподдерживаемых маршрутов возвращаем 404.
  // EN: Return 404 for unsupported routes.
  if (!languages.includes(lang) || !isAvailableSection(section)) {
    notFound();
  }

  // RU: Передаём язык и раздел в компонент страницы.
  // EN: Pass the language and section to the page component.
  return <SectionPage lang={lang} section={section} />;
}
