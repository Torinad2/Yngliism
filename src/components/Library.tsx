'use client';
import { useState } from 'react';
import Link from 'next/link';
import { articleUrl, categoryLabel, copy, type Language, type Section } from '@/lib/i18n';
type Entry = {slug:string;title:string;description:string;category:string;content:string};
export default function Library({lang,section,articles}: {lang:Language;section:Section;articles:Entry[]}) {
 const [query,setQuery]=useState(''); const t=copy[lang];
 const visible=articles.filter(a=>(section!=='teachings'||a.category==='teachings')&&(section!=='timeline'||a.category==='history')).filter(a=>`${a.title} ${a.description} ${categoryLabel(a.category,lang)} ${a.content}`.toLocaleLowerCase(lang).includes(query.trim().toLocaleLowerCase(lang)));
 return <section className={section==='home'?'':'library-section'}><div className="section-head"><div><div className="eyebrow">{t.section}</div><h2>{section==='teachings'?t.nav[1]:section==='timeline'?t.history:t.library}</h2><div className="small">{t.sub}</div></div><input className="search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={t.search} aria-label={t.search}/></div><div className="grid">{visible.map((a,i)=><Link className="card" key={a.slug} href={articleUrl(lang,a.slug)}><span className="num">{String(i+1).padStart(2,'0')}</span><div className="eyebrow" style={{marginTop:14}}>{categoryLabel(a.category,lang)}</div><h3>{a.title}</h3><p>{a.description}</p><span className="read">{t.read}</span></Link>)}</div>{!visible.length&&<p className="empty" role="status">{t.empty}</p>}</section>;
}
