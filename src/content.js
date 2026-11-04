import { parse } from 'yaml';

// Vite находит все Markdown-файлы. Новый файл появляется без правки списка.
const files = import.meta.glob('../articles/*/*.md', {
  query: '?raw', import: 'default', eager: true,
});
const seen = new Set();
export const articles = Object.entries(files).map(([path, raw]) => {
  const match = raw.replace(/\r\n?/g, '\n').match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${path}: отсутствует блок метаданных ---`);
  const meta = parse(match[1]);
  for (const field of ['slug', 'title', 'category']) {
    if (typeof meta?.[field] !== 'string' || !meta[field].trim()) {
      throw new Error(`${path}: заполните поле ${field}`);
    }
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.slug)) throw new Error(`${path}: некорректный slug`);
  const language = path.split('/').at(-2);
  if (!['ru','en'].includes(language)) throw new Error(`${path}: неизвестный язык`);
  if (!['draft','published'].includes(meta.status)) throw new Error(`${path}: status должен быть draft или published`);
  if (meta.description != null && typeof meta.description !== 'string') throw new Error(`${path}: description должен быть строкой`);
  const key = `${language}/${meta.slug}`;
  if (seen.has(key)) throw new Error(`${path}: повторяется slug ${key}`);
  seen.add(key);
  return { ...meta, description: meta.description || '', language, content: match[2].trim() };
}).filter(article => article.status === 'published')
  .sort((a,b) => a.title.localeCompare(b.title));
