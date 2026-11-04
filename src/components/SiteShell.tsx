import Link from 'next/link';
import { copy, languages, routes, sectionUrl, type Language, type Section } from '@/lib/i18n';
export default function SiteShell({lang,active,children,alternate}: {lang:Language;active:Section | 'article';children:React.ReactNode;alternate?:string}) {
 const t=copy[lang];
 return <><header><Link className="brand" href={`/${lang}/`}>YNG<span>LIISM</span></Link><nav aria-label={lang==='ru'?'Основное меню':'Main navigation'}>{routes.map((route,i)=><Link key={route} href={sectionUrl(lang,route)} aria-current={active===route?'page':undefined}>{t.nav[i]}</Link>)}</nav><div className="languages">{languages.map(l=><Link key={l} href={alternate ? `/${l}/article/${encodeURIComponent(alternate)}/` : sectionUrl(l,active==='article'?'articles':active)} className={l===lang?'active':''} hrefLang={l}>{l.toUpperCase()}</Link>)}</div></header><main id="main">{children}</main><footer><span>{t.footer}</span><span>{t.footer2}</span></footer></>;
}
