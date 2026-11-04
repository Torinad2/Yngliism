import Link from 'next/link';
import Library from './Library';
import SiteShell from './SiteShell';
import { copy, type Language, type Section } from '@/lib/i18n';
import { getArticles } from '@/lib/articles';
export default function SectionPage({lang,section}: {lang:Language;section:Section}) {
 const t=copy[lang];
 const about=<section className="about"><h2>{t.about}</h2><p>{t.aboutText}</p></section>;
 return <SiteShell lang={lang} active={section}>{section==='about'?<div style={{paddingTop:40}}>{about}</div>:<>{section==='home'&&<section className="hero"><div><div className="eyebrow">{t.eye}</div><h1>{lang==='ru'?<>Пространство<br/>для <em>понимания.</em></>:<>A space for<br/><em>understanding.</em></>}</h1><p className="intro">{t.intro}</p><Link className="primary" href={`/${lang}/articles/`}>{t.explore}</Link></div><div className="art" role="img" aria-label={lang==='ru'?'Солнце и холмы':'Sun and hills'}><div className="sun"/><div className="hill second"/><div className="hill"/><div className="hill third"/><div className="art-label">{t.art}</div></div></section>}<Library lang={lang} section={section} articles={getArticles(lang)}/>{about}</>}</SiteShell>;
}
