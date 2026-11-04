# Yngliism — публикация

## Локальная проверка

```powershell
npm install
npm run typecheck
npm run build
```

Проверь `out/sitemap.xml`, `out/robots.txt`, страницы `/ru/`, `/en/` и поиск в обеих языковых версиях (`npm run dev`). Поиск уже реализован в `src/components/Library.tsx`: фильтрация по заголовку, описанию, категории и тексту статей, без сервера.

## GitHub

```powershell
git status
git remote -v
git add .
git commit -m "Migrate Yngliism to Next.js and add SEO"
git push origin main
```

Если текущая ветка не `main`, проверь `git branch --show-current` и отправь её в нужную ветку. Не запускай `git init`, если репозиторий уже подключён. `.next`, `out` и `node_modules` не коммитятся.

## Cloudflare Pages (статический экспорт)

В существующем Pages-проекте открой Settings → Builds & deployments, укажи:

- Framework preset: Next.js (Static HTML Export), если доступен; иначе Custom.
- Build command: `npm run build`
- Build output directory: `out`
- Root directory: каталог, в котором находится `package.json` (обычно `/`).
- Node.js: совместимая LTS-версия (например, 22).

Проверь привязку GitHub-репозитория и ветки `main`, затем запусти новую сборку. Убедись, что домен `yngliism.com` привязан к нужному Pages-проекту. Если Cloudflare предлагает только Next.js preset с Workers, выбери Custom для статического `out`.

## Проверка после публикации

- `https://yngliism.com/ru/`
- `https://yngliism.com/en/`
- `https://yngliism.com/sitemap.xml`
- `https://yngliism.com/robots.txt`
- Поиск по словам из обеих статей и проверка пустой выдачи.

Не меняй DNS и не удаляй старый Pages-проект до успешной публикации.
