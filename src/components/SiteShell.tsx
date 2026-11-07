import Link from "next/link";

import {
  copy,
  languages,
  routes,
  sectionUrl,
  type Language,
  type Section,
} from "@/lib/i18n";

type SiteShellProps = {
  lang: Language;
  active: Section | "article";
  children: React.ReactNode;
  alternate?: string;
};

export default function SiteShell({
  lang,
  active,
  children,
  alternate,
}: SiteShellProps) {
  const t = copy[lang];

  return (
    <>
      {/* Site header */}
      <header>
        {/* Website logo */}
        <Link className="brand" href={`/${lang}/`}>
          YNG<span>LIISM</span>
        </Link>

        {/* Main navigation */}
        <nav aria-label={lang === "ru" ? "Основное меню" : "Main navigation"}>
          {routes.map((route, i) => (
            <Link
              key={route}
              href={sectionUrl(lang, route)}
              aria-current={active === route ? "page" : undefined}
            >
              {t.nav[i]}
            </Link>
          ))}
        </nav>

        {/* Language switcher */}
        <div className="languages">
          {languages.map((l) => (
            <Link
              key={l}
              href={
                alternate
                  ? `/${l}/article/${encodeURIComponent(alternate)}/`
                  : sectionUrl(l, active === "article" ? "articles" : active)
              }
              className={l === lang ? "active" : ""}
              hrefLang={l}
            >
              {l.toUpperCase()}
            </Link>
          ))}
        </div>
      </header>

      {/* Main page content */}
      <main id="main">{children}</main>

      {/* Site footer */}
      <footer>
        <span>{t.footer}</span>
        <span>{t.footer2}</span>
      </footer>
    </>
  );
}
