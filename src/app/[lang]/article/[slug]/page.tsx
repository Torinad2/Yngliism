import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

import SiteShell from "@/components/SiteShell";
import { getArticles, allArticleParams } from "@/lib/articles";
import { copy, categoryLabel, languages, type Language } from "@/lib/i18n";
import { articleAlternates } from "@/lib/seo";

export function generateStaticParams() {
  return allArticleParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Language; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;

  const a = getArticles(lang).find((a) => a.slug === slug);

  return {
    title: a?.title ?? "Yngliism",
    description: a?.description,

    alternates: {
      canonical: `/${lang}/article/${slug}/`,
      languages: articleAlternates(slug),
    },

    openGraph: {
      title: a?.title ?? "Yngliism",
      description: a?.description,
      url: `/${lang}/article/${slug}/`,
      type: "article",
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ lang: Language; slug: string }>;
}) {
  const { lang, slug } = await params;

  if (!languages.includes(lang)) {
    notFound();
  }

  const a = getArticles(lang).find((a) => a.slug === slug);

  if (!a) {
    notFound();
  }

  const t = copy[lang];

  let source: string | undefined;

  try {
    const u = new URL(a.source_url ?? "");

    if (["https:", "http:"].includes(u.protocol)) {
      source = u.href;
    }
  } catch {}

  return (
    <SiteShell lang={lang} active="article" alternate={slug}>
      <article className="article">
        <Link className="back" href={`/${lang}/articles/`}>
          {t.back}
        </Link>

        <p className="eyebrow">{categoryLabel(a.category, lang)}</p>

        <h1>{a.title}</h1>

        <p className="intro">{a.description}</p>

        <ReactMarkdown skipHtml>{a.content}</ReactMarkdown>

        {source && (
          <p>
            <a href={source} rel="noopener noreferrer">
              {t.source}
            </a>
          </p>
        )}
      </article>
    </SiteShell>
  );
}
