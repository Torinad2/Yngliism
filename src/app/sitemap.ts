import type { MetadataRoute } from "next";

import { languages, routes } from "@/lib/i18n";
import { sectionPath, siteUrl } from "@/lib/seo";

// RU: Генерируем статическую карту сайта для Cloudflare Pages.
// EN: Generate a static sitemap for Cloudflare Pages.
export const dynamic = "force-static";

// RU: Создаём карту сайта.
// EN: Generate the website sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  // RU: Основной адрес сайта.
  // EN: Main website URL.
  const pages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // RU: Добавляем страницы всех поддерживаемых языков.
  // EN: Add pages for all supported languages.
  for (const lang of languages) {
    for (const section of routes) {
      // RU: Полный URL текущей страницы.
      // EN: Full URL of the current page.
      const url = siteUrl + sectionPath(lang, section);

      pages.push({
        url,

        // RU: Частота предполагаемого обновления страницы.
        // EN: Expected page update frequency.
        changeFrequency: "weekly",

        // RU: Главная страница имеет более высокий приоритет.
        // EN: The home page has a higher priority.
        priority: section === "home" ? 1 : 0.7,

        // RU: Языковые альтернативы для поисковых систем.
        // EN: Language alternatives for search engines.
        alternates: {
          languages: Object.fromEntries(
            languages.map((language) => [
              language,
              siteUrl + sectionPath(language, section),
            ]),
          ),
        },
      });
    }
  }

  return pages;
}
