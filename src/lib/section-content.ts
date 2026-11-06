import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

import type { Language } from "./i18n";

export type ContentSection =
  | "articles"
  | "teachings"
  | "commandments"
  | "library";

export type ContentItem = {
  slug: string;
  title: string;
  description: string;
  category: string;
  author?: string;
  order?: number;
  source_url?: string;
  content: string;
};

export function getSectionContent(
  section: ContentSection,
  lang: Language,
): ContentItem[] {
  const dir = path.join(process.cwd(), section, lang);

  if (!fs.existsSync(dir)) {
    return [];
  }

  const seen = new Set<string>();

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") && file !== "introduction.md")
    .map((file) => {
      const raw = fs
        .readFileSync(path.join(dir, file), "utf8")
        .replace(/\r\n?/g, "\n");

      const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

      if (!match) {
        throw new Error(`${section}/${lang}/${file}: missing YAML frontmatter`);
      }

      const meta = parse(match[1]) as Record<string, unknown>;

      if (meta.status !== "draft" && meta.status !== "published") {
        throw new Error(`${file}: invalid status`);
      }

      for (const key of ["slug", "title"]) {
        if (typeof meta[key] !== "string" || !meta[key].trim()) {
          throw new Error(`${file}: missing ${key}`);
        }
      }

      const slug = meta.slug as string;

      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || seen.has(slug)) {
        throw new Error(`${file}: invalid or duplicate slug`);
      }

      seen.add(slug);

      for (const key of ["description", "category", "author", "source_url"]) {
        if (meta[key] != null && typeof meta[key] !== "string") {
          throw new Error(`${file}: invalid ${key}`);
        }
      }

      if (
        meta.order != null &&
        (!Number.isInteger(meta.order) || (meta.order as number) < 1)
      ) {
        throw new Error(`${file}: invalid order`);
      }

      return {
        slug,
        title: meta.title as string,
        description: (meta.description as string) || "",
        category: (meta.category as string) || "",
        author: meta.author as string | undefined,
        order: meta.order as number | undefined,
        source_url: meta.source_url as string | undefined,
        content: match[2].trim(),
        published: meta.status === "published",
      };
    })
    .filter((item) => item.published)
    .map(({ published, ...item }) => item)
    .sort((a, b) =>
      section === "commandments"
        ? (a.order ?? Number.MAX_SAFE_INTEGER) -
            (b.order ?? Number.MAX_SAFE_INTEGER) ||
          a.title.localeCompare(b.title)
        : a.title.localeCompare(b.title, lang),
    );
}
