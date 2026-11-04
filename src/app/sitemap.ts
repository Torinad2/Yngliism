import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/articles";
import { languages, routes } from "@/lib/i18n";
import { articleAlternates, sectionPath, siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    {
      url: siteUrl + "/",
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  for (const lang of languages) {
    for (const section of routes) {
      pages.push({
        url: siteUrl + sectionPath(lang, section),
        changeFrequency: "weekly",
        priority: section === "home" ? 1 : 0.7,
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

    for (const article of getArticles(lang)) {
      pages.push({
        url: `${siteUrl}/${lang}/article/${article.slug}/`,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            Object.entries(articleAlternates(article.slug)).map(
              ([language, articlePath]) => [language, siteUrl + articlePath],
            ),
          ),
        },
      });
    }
  }

  return pages;
}
