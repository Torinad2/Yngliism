import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ReactMarkdown from 'react-markdown';
import { articles } from './content';
import { copy } from './copy';
import '../css/style.css';

const routes = ['home', 'teachings', 'articles', 'timeline', 'about'];
const categoryNames = {teachings:['Учение','Teachings'],history:['История','History'],articles:['Статьи','Articles']};
const categoryLabel = (category, lang) => categoryNames[category]?.[lang === 'ru' ? 0 : 1] || category;
function initialLanguage() {
  try { return localStorage.getItem('ingliism-language') === 'en' ? 'en' : 'ru'; }
  catch { return 'ru'; }
}
function safeSource(value) {
  try { const url = new URL(value); return ['http:','https:'].includes(url.protocol) ? url.href : null; }
  catch { return null; }
}
function App() {
  const [lang, setLang] = useState(initialLanguage);
  const [route, setRoute] = useState(() => location.hash.slice(1) || 'home');
  const [query, setQuery] = useState('');
  const t = copy[lang];
  useEffect(() => {
    const change = () => { setRoute(location.hash.slice(1) || 'home'); setQuery(''); window.scrollTo(0,0); };
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);
  const isArticle = route.startsWith('article/');
  let slug;
  try { slug = isArticle ? decodeURIComponent(route.slice(8)) : null; } catch { slug = null; }
  const article = articles.find(a => a.language === lang && a.slug === slug);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = `${article?.title || t.footer} · Yngliism`;
    try { localStorage.setItem('ingliism-language', lang); } catch { /* Без сохранения язык тоже работает. */ }
  }, [lang, article, t.footer]);
  const visible = articles.filter(a => a.language === lang)
    .filter(a => route !== 'teachings' || a.category === 'teachings')
    .filter(a => route !== 'timeline' || a.category === 'history')
    .filter(a => `${a.title} ${a.description} ${categoryLabel(a.category,lang)} ${a.content}`.toLocaleLowerCase(lang).includes(query.trim().toLocaleLowerCase(lang)));
  const about = <section className="about"><h2>{t.about}</h2><p>{t.aboutText}</p></section>;
  const source = safeSource(article?.source_url);
  const missing = lang === 'ru' ? 'Статья не найдена или ещё не переведена на русский язык.' : 'Article not found or not yet translated into English.';
  return <>
    <header>
      <a className="brand" href="#home">YNG<span>LIISM</span></a>
      <nav aria-label={lang === 'ru' ? 'Основное меню' : 'Main navigation'}>{routes.map((item,i) => <a key={item} href={`#${item}`} aria-current={item === route ? 'page' : undefined}>{t.nav[i]}</a>)}</nav>
      <div className="languages">{['ru','en'].map(l => <button type="button" key={l} className={l === lang ? 'active' : ''} aria-pressed={l === lang} onClick={() => {setLang(l); setQuery('');}}>{l.toUpperCase()}</button>)}</div>
    </header>
    <main id="main">
      {isArticle ? <article className="article"><a className="back" href="#articles">{t.back}</a>{article ? <>
        <p className="eyebrow">{categoryLabel(article.category,lang)}</p><h1>{article.title}</h1><p className="intro">{article.description}</p>
        {/* HTML из статьи не выполняется. Markdown обрабатывается React-компонентом. */}
        <ReactMarkdown>{article.content}</ReactMarkdown>
        {source && <p><a href={source} rel="noopener noreferrer">{lang === 'ru' ? 'Источник' : 'Source'}</a></p>}
      </> : <p role="status">{missing}</p>}</article>
      : route === 'about' ? <div style={{paddingTop:40}}>{about}</div>
      : routes.includes(route) ? <>
        {route === 'home' && <section className="hero"><div><div className="eyebrow">{t.eye}</div>
          <h1>{lang === 'ru' ? <>Пространство<br/>для <em>понимания.</em></> : <>A space for<br/><em>understanding.</em></>}</h1>
          <p className="intro">{t.intro}</p><a className="primary" href="#articles">{t.explore}</a>
        </div><div className="art" role="img" aria-label={lang === 'ru' ? 'Солнце и холмы' : 'Sun and hills'}><div className="sun"/><div className="hill second"/><div className="hill"/><div className="hill third"/><div className="art-label">{t.art}</div></div></section>}
        <section className={route === 'home' ? '' : 'library-section'}>
          <div className="section-head"><div><div className="eyebrow">{t.section}</div><h2>{route === 'teachings' ? t.nav[1] : route === 'timeline' ? t.history : t.library}</h2><div className="small">{t.sub}</div></div>
            <input className="search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={t.search} aria-label={t.search}/>
          </div>
          <div className="grid">{visible.map((a,i) => <a className="card" key={a.slug} href={`#article/${encodeURIComponent(a.slug)}`}>
            <span className="num">{String(i+1).padStart(2,'0')}</span><div className="eyebrow" style={{marginTop:14}}>{categoryLabel(a.category,lang)}</div><h3>{a.title}</h3><p>{a.description}</p><span className="read">{t.read}</span>
          </a>)}</div>
          {!visible.length && <p className="empty" role="status">{t.empty}</p>}
        </section>{about}
      </> : <article className="article"><a href="#home">{t.nav[0]}</a><p>{lang === 'ru' ? 'Страница не найдена.' : 'Page not found.'}</p></article>}
    </main>
    <footer><span>{t.footer}</span><span>{t.footer2}</span></footer>
  </>;
}
createRoot(document.getElementById('root')).render(<App/>);
