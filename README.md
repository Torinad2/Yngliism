# Yngliism — Next.js + React + TypeScript

Migrated from the supplied Vite/React project. The existing CSS and both Markdown articles are preserved. Articles remain in `articles/ru` and `articles/en`.

## Windows 11 / VS Code

Install Node.js 22.12+ (or compatible newer LTS), open this folder in VS Code, then:

```powershell
npm install
npm run dev
```

Open http://localhost:3000/ru/ . Live Server is **not** used.

## Static deployment (Cloudflare Pages)

```powershell
npm run typecheck
npm run build
```

The output directory is `out`. Cloudflare Pages build command: `npm run build`; output directory: `out`. The site is static: Next.js server actions, route handlers and dynamic SSR are not available in this deployment. If moving to a server backend later, change the deployment approach.

## Articles

Add Markdown files to `articles/ru` or `articles/en`. Each file requires YAML frontmatter: `slug`, `title`, `category`, `status: published`. Optional: `description`, `source_url`. Use the same slug for translations. `status: draft` excludes the article from the site. Search covers title, description, category and content.

Routes: `/ru/`, `/en/`, `/ru/articles/`, `/ru/teachings/`, `/ru/timeline/`, `/ru/about/`, `/ru/article/ingliizm-introduction/` (and English equivalents). The root displays language links to `/ru/` and `/en/`.

**Note:** This is a static site: each Markdown update requires a new build/deployment. The legacy Vite files and `node_modules` were intentionally excluded. Keep the original project backed up until this version is tested.
