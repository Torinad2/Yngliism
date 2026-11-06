'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { ContentItem } from '@/lib/section-content';
import { categoryLabel, type Language } from '@/lib/i18n';

export default function ArticleCatalog({lang, items}: {lang: Language; items: ContentItem[]}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const categories = useMemo(() => [...new Set(items.map(a => a.category).filter(Boolean))].sort(), [items]);
  const visible = items.filter(a => (!category || a.category === category) &&
    `${a.title} ${a.description} ${a.category} ${a.content}`.toLocaleLowerCase(lang).includes(query.trim().toLocaleLowerCase(lang)));
  return <section className="library-section">
    <div className="section-head"><div><h2>{lang === 'ru' ? 'Статьи' : 'Articles'}</h2></div>
      <input className="search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={lang === 'ru' ? 'Поиск статей' : 'Search articles'} aria-label={lang === 'ru' ? 'Поиск статей' : 'Search articles'}/></div>
    <label>{lang === 'ru' ? 'Категория: ' : 'Category: '}
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">{lang === 'ru' ? 'Все категории' : 'All categories'}</option>
        {categories.map(c => <option key={c} value={c}>{categoryLabel(c,lang)}</option>)}
      </select>
    </label>
    <div className="grid">{visible.map(a => <Link className="card" key={a.slug} href={`/${lang}/article/${a.slug}`}>
      <div className="eyebrow">{categoryLabel(a.category,lang)}</div><h3>{a.title}</h3><p>{a.description}</p>
      <span className="read">{lang === 'ru' ? 'Читать' : 'Read'}</span>
    </Link>)}</div>
    {!visible.length && <p className="empty" role="status">{lang === 'ru' ? 'Ничего не найдено' : 'Nothing found'}</p>}
  </section>;
}
