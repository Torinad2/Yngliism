import Link from 'next/link';
import SiteShell from './SiteShell';
import ArticleCatalog from './ArticleCatalog';
import BookCatalog from './BookCatalog';
import CommandmentsList from './CommandmentsList';
import { copy, type Language, type Section } from '@/lib/i18n';
import { getSectionContent } from '@/lib/section-content';

export default function SectionPage({lang,section}: {lang:Language;section:Section}) {
  const t=copy[lang];
  const about=<section className="about"><h2>{t.about}</h2><p>{t.aboutText}</p></section>;
  return <SiteShell lang={lang} active={section}>
    {section==='home' && <section className="hero"><div><div className="eyebrow">{t.eye}</div><h1>{lang==='ru'?<>Пространство<br/>для <em>понимания.</em></>:<>A space for<br/><em>understanding.</em></>}</h1><p className="intro">{t.intro}</p><Link className="primary" href={`/${lang}/articles/`}>{t.explore}</Link></div><div className="art" role="img" aria-label={lang==='ru'?'Солнце и холмы':'Sun and hills'}><div className="sun"/><div className="hill second"/><div className="hill"/><div className="hill third"/><div className="art-label">{t.art}</div></div></section>}
    {section==='articles' && <ArticleCatalog lang={lang} items={getSectionContent('articles',lang)}/>}
    {section==='library' && <BookCatalog lang={lang} items={getSectionContent('library',lang)}/>}
    {section==='commandments' && <CommandmentsList lang={lang} items={getSectionContent('commandments',lang)}/>}
    {section==='teachings' && <section className="library-section"><h2>{t.nav[1]}</h2><div className="grid">{getSectionContent('teachings',lang).map(item=><article className="card" key={item.slug}><h3>{item.title}</h3><p>{item.description}</p><p style={{whiteSpace:'pre-line'}}>{item.content}</p>{item.source_url&&<a className="read" href={item.source_url} target="_blank" rel="noopener noreferrer">{t.source}</a>}</article>)}</div></section>}
    {section==='timeline' && <section className="library-section"><h2>{t.history}</h2></section>}
    {section==='about' && <div style={{paddingTop:40}}>{about}</div>}
  </SiteShell>;
}
