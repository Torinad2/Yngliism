import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import type { Language } from "./i18n";

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  status: "draft" | "published";
  language: Language;
  content: string;
  source_url?: string;
};

const root = path.join(process.cwd(), "content", "articles");

export function getArticles(lang: Language): Article[] {
  const dir = path.join(root, lang);

  if (!fs.existsSync(dir)) {
    return [];
  }

  const seen = new Set<string>();

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file): Article => {
      const raw = fs
        .readFileSync(path.join(dir, file), "utf8")
        .replace(/\r\n?/g, "\n");

      const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

      if (!match) {
        throw new Error(`${file}: missing YAML frontmatter`);
      }

      const meta = parse(match[1]) as Record<string, unknown>;

      for (const key of ["slug", "title", "category"]) {
        if (typeof meta[key] !== "string" || !(meta[key] as string).trim()) {
          throw new Error(`${file}: missing ${key}`);
        }
      }

      if (
        typeof meta.slug !== "string" ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.slug)
      ) {
        throw new Error(`${file}: invalid slug`);
      }

      if (seen.has(meta.slug)) {
        throw new Error(`${file}: duplicate slug`);
      }

      seen.add(meta.slug);

      if (meta.status !== "draft" && meta.status !== "published") {
        throw new Error(`${file}: invalid status`);
      }

      if (meta.description != null && typeof meta.description !== "string") {
        throw new Error(`${file}: invalid description`);
      }

      if (meta.source_url != null && typeof meta.source_url !== "string") {
        throw new Error(`${file}: invalid source_url`);
      }

      const status: Article["status"] = meta.status;

      return {
        slug: meta.slug,
        title: meta.title as string,
        category: meta.category as string,
        description: (meta.description as string) || "",
        status,
        source_url: meta.source_url as string | undefined,
        language: lang,
        content: match[2].trim(),
      };
    })
    .filter((article) => article.status === "published")
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function allArticleParams() {
  return (["ru", "en"] as const).flatMap((lang) =>
    getArticles(lang).map((article) => ({
      lang,
      slug: article.slug,
    })),
  );
}
