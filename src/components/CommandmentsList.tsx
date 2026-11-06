import type { ContentItem } from '@/lib/section-content';
import type { Language } from '@/lib/i18n';
export default function CommandmentsList({lang,items}: {lang:Language;items:ContentItem[]}) {
  return <section className="library-section"><h2>{lang === 'ru' ? 'Заповеди' : 'Commandments'}</h2>
    <ol>{items.map((item,index) => <li className="card" key={item.slug} value={item.order ?? index + 1}>
      <h3>{item.title}</h3><p style={{whiteSpace:'pre-line'}}>{item.content}</p>
    </li>)}</ol>
    {!items.length && <p className="empty">{lang === 'ru' ? 'Заповедей пока нет' : 'No commandments yet'}</p>}
  </section>;
}
