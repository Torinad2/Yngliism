// RU: Импортируем компонент Link для навигации между страницами без полной перезагрузки.
// EN: Import the Link component for navigation without a full page reload.
import Link from "next/link";

// RU: Главный компонент корневой страницы сайта (/).
// EN: Main component for the website's root page (/).
export default function Root() {
  return (
    // RU: Основной контейнер страницы с отступами и выравниванием текста по центру.
    // EN: Main page container with padding and centered text.
    <main
      style={{
        padding: "4rem", // RU: Внутренние отступы. EN: Inner spacing.
        textAlign: "center", // RU: Выравнивание по центру. EN: Center text alignment.
      }}
    >
      {/* RU: Главный заголовок сайта. */}
      {/* EN: Main website heading. */}
      <h1>Yngliism</h1>

      {/* RU: Ссылки для выбора языка сайта. */}
      {/* EN: Links for selecting the website language. */}
      <p>
        {/* RU: Переход на русскую версию. */}
        {/* EN: Navigate to the Russian version. */}
        <Link href="/ru/">Русский</Link>

        {/* RU: Разделитель между ссылками. */}
        {/* EN: Separator between links. */}
        {" · "}

        {/* RU: Переход на английскую версию. */}
        {/* EN: Navigate to the English version. */}
        <Link href="/en/">English</Link>
      </p>
    </main>
  );
}
