//
// RU: Поддерживаемые языки сайта.
// EN: Supported website languages.
//
export const languages = ["ru", "en", "es"] as const;

export type Language = (typeof languages)[number];

//
// RU: Доступные разделы сайта.
// EN: Available website sections.
//
export const routes = ["home", "commandments"] as const;

export type Section = (typeof routes)[number];

//
// RU: Разделы главного меню.
// EN: Main navigation sections.
//
export const navRoutes = routes;

//
// RU: Переводы интерфейса сайта.
// EN: Website interface translations.
//
export const copy = {
  ru: {
    // RU: Главное меню.
    // EN: Main navigation.
    nav: ["Главная", "Заповеди"],

    // RU: Главная страница.
    // EN: Home page.
    eye: "Открытая библиотека",

    intro:
      "Знакомьтесь с идеями, изучайте источники и находите ответы на свои вопросы. В своём темпе, с вниманием к деталям.",

    // RU: Нижняя часть сайта.
    // EN: Website footer.
    footer: "Библиотека знаний",
    footer2: "Русский / English / Español · Без регистрации",
  },

  en: {
    // RU: Главное меню.
    // EN: Main navigation.
    nav: ["Home", "Commandments"],

    // RU: Главная страница.
    // EN: Home page.
    eye: "An open library",

    intro:
      "Explore ideas, read sources, and find answers to your questions. At your own pace, with attention to detail.",

    // RU: Нижняя часть сайта.
    // EN: Website footer.
    footer: "A library of knowledge",
    footer2: "Русский / English / Español · No registration",
  },

  es: {
    // RU: Главное меню.
    // EN: Main navigation.
    nav: ["Inicio", "Mandamientos"],

    // RU: Главная страница.
    // EN: Home page.
    eye: "Una biblioteca abierta",

    intro:
      "Explora ideas, consulta fuentes y encuentra respuestas a tus preguntas. A tu propio ritmo y con atención a los detalles.",

    // RU: Нижняя часть сайта.
    // EN: Website footer.
    footer: "Una biblioteca de conocimiento",
    footer2: "Русский / English / Español · Sin registro",
  },
} as const;

//
// RU: Формируем URL раздела для выбранного языка.
// EN: Generate a section URL for the selected language.
//
export function sectionUrl(lang: Language, section: Section): string {
  return `/${lang}/${section === "home" ? "" : `${section}/`}`;
}
