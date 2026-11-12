import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

import type { Language } from "./i18n";

// RU: Структура одной заповеди.
// EN: Structure of a single commandment.
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

// RU: Русский язык используется по умолчанию.
// EN: Russian is the default fallback language.
const DEFAULT_LANGUAGE = "RU";

// RU: Каталог Markdown-файлов заповедей.
// EN: Directory containing commandment Markdown files.
const COMMANDMENTS_DIR = path.join(process.cwd(), "content", "commandments");

// RU: Внутренняя структура с состоянием публикации.
// EN: Internal structure containing publication status.
type ParsedItem = ContentItem & {
  published: boolean;
};

// RU: Читаем Markdown-файл и проверяем YAML frontmatter.
// EN: Read a Markdown file and validate YAML frontmatter.
function readContentFile(filePath: string): ParsedItem {
  const file = path.basename(filePath);

  // RU: Читаем текст и нормализуем переносы строк.
  // EN: Read text and normalize line endings.
  const raw = fs
    .readFileSync(filePath, "utf8")
    .replace(/^\uFEFF/, "")
    .replace(/\r\n?/g, "\n");

  // RU: Отделяем YAML от Markdown.
  // EN: Separate YAML from Markdown.
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(`${file}: missing YAML frontmatter`);
  }

  // RU: Преобразуем YAML в объект.
  // EN: Parse YAML into an object.
  const parsed = parse(match[1]);

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${file}: invalid YAML frontmatter`);
  }

  const meta = parsed as Record<string, unknown>;

  // RU: Проверяем статус публикации.
  // EN: Validate publication status.
  if (meta.status !== "draft" && meta.status !== "published") {
    throw new Error(`${file}: invalid status`);
  }

  // RU: Проверяем обязательные поля.
  // EN: Validate required fields.
  for (const key of ["slug", "title"]) {
    if (typeof meta[key] !== "string" || !meta[key].trim()) {
      throw new Error(`${file}: missing ${key}`);
    }
  }

  const slug = meta.slug as string;

  // RU: Проверяем формат slug.
  // EN: Validate slug format.
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`${file}: invalid slug`);
  }

  // RU: Проверяем необязательные строковые поля.
  // EN: Validate optional string fields.
  for (const key of ["description", "category", "author", "source_url"]) {
    if (meta[key] != null && typeof meta[key] !== "string") {
      throw new Error(`${file}: invalid ${key}`);
    }
  }

  // RU: Проверяем порядок отображения.
  // EN: Validate display order.
  if (
    meta.order != null &&
    (typeof meta.order !== "number" ||
      !Number.isInteger(meta.order) ||
      meta.order < 0)
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
}

// RU: Загружаем заповеди на выбранном языке.
// EN: Load commandments in the selected language.
export function getSectionContent(
  section: "commandments",
  lang: Language,
): ContentItem[] {
  // RU: Сохраняем параметр section для совместимости
  //     с существующим SectionPage.tsx.
  // EN: Keep section for compatibility with SectionPage.tsx.
  void section;

  if (!fs.existsSync(COMMANDMENTS_DIR)) {
    return [];
  }

  // RU: Группируем переводы по имени файла.
  // EN: Group translations by filename.
  const groups = new Map<string, Map<string, string>>();

  for (const file of fs.readdirSync(COMMANDMENTS_DIR)) {
    // RU: Пропускаем файлы, не соответствующие формату.
    // EN: Skip files that do not match the naming convention.
    const match = file.match(/^(.+)_(RU|EN|ES)\.md$/i);

    if (!match) {
      continue;
    }

    const baseName = match[1];
    const language = match[2].toUpperCase();

    // RU: Введение загружается отдельной функцией.
    // EN: Introduction is loaded by a separate function.
    if (baseName.toLowerCase() === "introduction") {
      continue;
    }

    if (!groups.has(baseName)) {
      groups.set(baseName, new Map());
    }

    const translations = groups.get(baseName)!;

    // RU: Не допускаем повторяющихся переводов.
    // EN: Prevent duplicate language files.
    if (translations.has(language)) {
      throw new Error(`${file}: duplicate language file`);
    }

    translations.set(language, path.join(COMMANDMENTS_DIR, file));
  }

  const requestedLanguage = lang.toUpperCase();

  const seen = new Set<string>();
  const items: ContentItem[] = [];

  // RU: Обрабатываем группы переводов.
  // EN: Process translation groups.
  for (const [baseName, translations] of groups) {
    // RU: Русский оригинал обязателен.
    // EN: A Russian original is required.
    const russianPath = translations.get(DEFAULT_LANGUAGE);

    if (!russianPath) {
      throw new Error(`${baseName}: missing Russian original`);
    }

    const russianItem = readContentFile(russianPath);

    // RU: Черновики русского оригинала не публикуются.
    // EN: Unpublished Russian originals are excluded.
    if (!russianItem.published) {
      continue;
    }

    // RU: По умолчанию используем русский оригинал.
    // EN: Use the Russian original by default.
    let selectedItem = russianItem;

    const localizedPath = translations.get(requestedLanguage);

    if (localizedPath && localizedPath !== russianPath) {
      const localizedItem = readContentFile(localizedPath);

      // RU: У всех переводов должен совпадать slug.
      // EN: All translations must share the same slug.
      if (localizedItem.slug !== russianItem.slug) {
        throw new Error(`${baseName}: translation slug mismatch`);
      }

      // RU: Используем только опубликованный перевод.
      // EN: Use only a published translation.
      if (localizedItem.published) {
        selectedItem = localizedItem;
      }
    }

    // RU: Проверяем уникальность slug.
    // EN: Validate slug uniqueness.
    if (seen.has(russianItem.slug)) {
      throw new Error(`${baseName}: duplicate slug ${russianItem.slug}`);
    }

    seen.add(russianItem.slug);

    // RU: Убираем внутренний статус публикации.
    // EN: Remove internal publication status.
    const { published, ...content } = selectedItem;

    items.push({
      ...content,
      slug: russianItem.slug,
      order: russianItem.order,
    });
  }

  // RU: Сортируем по порядку русского оригинала.
  // EN: Sort by the Russian original's display order.
  return items.sort(
    (a, b) =>
      (a.order ?? Number.MAX_SAFE_INTEGER) -
        (b.order ?? Number.MAX_SAFE_INTEGER) ||
      a.title.localeCompare(b.title, lang),
  );
}
