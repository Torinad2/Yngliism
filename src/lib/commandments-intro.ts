import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

import type { Language } from "@/lib/i18n";

// RU: Основной язык при отсутствии перевода.
// EN: Default language when a translation is missing.
const DEFAULT_LANGUAGE = "ru";

// RU: Папка с Markdown-файлами заповедей.
// EN: Directory containing commandments Markdown files.
const COMMANDMENTS_DIR = path.join(process.cwd(), "content", "commandments");

// RU: Результат чтения введения.
// EN: Result of reading an introduction.
type Introduction = {
  content: string;
  published: boolean;
};

// RU: Читаем Markdown и отделяем YAML frontmatter.
// EN: Read Markdown and separate YAML frontmatter.
function readIntroduction(filePath: string): Introduction {
  const filename = path.basename(filePath);

  // RU: Читаем файл и нормализуем переносы строк.
  // EN: Read the file and normalize line endings.
  const raw = fs
    .readFileSync(filePath, "utf8")
    .replace(/^\uFEFF/, "")
    .replace(/\r\n?/g, "\n");

  // RU: Проверяем наличие YAML frontmatter.
  // EN: Check whether YAML frontmatter exists.
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  // RU: Поддерживаем старые файлы без YAML.
  // EN: Support legacy files without YAML.
  if (!match) {
    return {
      content: raw.trim(),
      published: true,
    };
  }

  // RU: Преобразуем YAML в объект.
  // EN: Parse YAML into an object.
  const parsed = parse(match[1]);

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${filename}: invalid YAML frontmatter`);
  }

  const meta = parsed as Record<string, unknown>;

  // RU: Проверяем статус, если он указан.
  // EN: Validate publication status when provided.
  if (
    meta.status !== undefined &&
    meta.status !== "published" &&
    meta.status !== "draft"
  ) {
    throw new Error(`${filename}: invalid status`);
  }

  return {
    content: match[2].trim(),
    published: meta.status !== "draft",
  };
}

// RU: Загружаем введение на выбранном языке.
// EN: Load the introduction in the selected language.
export function getCommandmentsIntro(lang: Language): string {
  // RU: Русский оригинал обязателен.
  // EN: The Russian original is required.
  const fallbackPath = path.join(
    COMMANDMENTS_DIR,
    `introduction_${DEFAULT_LANGUAGE.toUpperCase()}.md`,
  );

  if (!fs.existsSync(fallbackPath)) {
    throw new Error(`Required Russian introduction not found: ${fallbackPath}`);
  }

  const russianIntro = readIntroduction(fallbackPath);

  // RU: Не публикуем введение, если русский оригинал — черновик.
  // EN: Do not publish the introduction if the Russian original is a draft.
  if (!russianIntro.published) {
    return "";
  }

  // RU: Для русского языка сразу возвращаем оригинал.
  // EN: Return the original directly for Russian.
  if (lang === DEFAULT_LANGUAGE) {
    return russianIntro.content;
  }

  // RU: Ищем перевод на выбранном языке.
  // EN: Find the translation for the selected language.
  const localizedPath = path.join(
    COMMANDMENTS_DIR,
    `introduction_${lang.toUpperCase()}.md`,
  );

  if (fs.existsSync(localizedPath)) {
    const localizedIntro = readIntroduction(localizedPath);

    // RU: Используем только опубликованный перевод.
    // EN: Use only a published translation.
    if (localizedIntro.published) {
      return localizedIntro.content;
    }
  }

  // RU: При отсутствии перевода используем русский текст.
  // EN: Fall back to Russian when a translation is unavailable.
  return russianIntro.content;
}
