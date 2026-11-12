import type { ReactNode } from "react";
import Link from "next/link";

import {
  copy,
  languages,
  navRoutes,
  sectionUrl,
  type Language,
  type Section,
} from "@/lib/i18n";

// RU: Свойства основного компонента сайта.
// EN: Properties of the main website component.
type SiteShellProps = {
  lang: Language;
  active: Section;
  children: ReactNode;
};

// RU: Основной компонент сайта: шапка, меню, контент и футер.
// EN: Main website component: header, navigation, content, and footer.
export default function SiteShell({ lang, active, children }: SiteShellProps) {
  // RU: Получаем переводы интерфейса для выбранного языка.
  // EN: Get interface translations for the selected language.
  const t = copy[lang];

  return (
    <>
      {/* RU: Шапка сайта. */}
      {/* EN: Website header. */}
      <header>
        {/* RU: Логотип со ссылкой на главную страницу. */}
        {/* EN: Website logo linking to the home page. */}
        <Link className="brand" href={sectionUrl(lang, "home")}>
          YNG<span>LIISM</span>
        </Link>

        {/* RU: Главное меню: Главная и Заповеди. */}
        {/* EN: Main navigation: Home and Commandments. */}
        <nav
          aria-label={
            lang === "ru"
              ? "Основное меню"
              : lang === "es"
                ? "Navegación principal"
                : "Main navigation"
          }
        >
          {navRoutes.map((route, i) => (
            <Link
              key={route}
              href={sectionUrl(lang, route)}
              aria-current={active === route ? "page" : undefined}
            >
              {t.nav[i]}
            </Link>
          ))}
        </nav>

        {/* RU: Переключатель языков: RU, EN, ES. */}
        {/* EN: Language switcher: RU, EN, ES. */}
        <div className="languages">
          {languages.map((language) => {
            // RU: Сохраняем текущий раздел при смене языка.
            // EN: Preserve the current section when switching languages.
            const href = sectionUrl(language, active);

            return (
              <Link
                key={language}
                href={href}
                className={language === lang ? "active" : ""}
                hrefLang={language}
                aria-current={language === lang ? "page" : undefined}
              >
                {language.toUpperCase()}
              </Link>
            );
          })}
        </div>
      </header>

      {/* RU: Основное содержимое текущей страницы. */}
      {/* EN: Main content of the current page. */}
      <main id="main">{children}</main>

      {/* RU: Нижняя часть сайта. */}
      {/* EN: Website footer. */}
      <footer>
        <span>{t.footer}</span>
        <span>{t.footer2}</span>
      </footer>
    </>
  );
}
