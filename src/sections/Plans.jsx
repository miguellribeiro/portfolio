import { useI18n } from '../i18n/context.js';
import { site } from '../engine/content.js';
import Section from '../components/Section.jsx';

function ctaHref(cta, label) {
  const c = site.contact;
  if (cta.type === 'whatsapp') return `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(label)}`;
  if (cta.type === 'email') return `mailto:${c.email}?subject=${encodeURIComponent(label)}`;
  return cta.href || '#contact';
}

export default function Plans({ id }) {
  const { t, locale, currency } = useI18n();
  const fmt = new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 });
  return (
    <Section id={id} title={t('plans.title')} subtitle={t('plans.subtitle')}>
      <div className="grid grid--3">
        {site.plans.map((p) => {
          const text = t(`plans.items.${p.id}`);
          const price = p.prices?.[currency];
          const external = p.cta.type !== 'email';
          return (
            <article key={p.id} className={`card plan ${p.highlight ? 'plan--highlight' : ''}`}>
              {p.highlight && <span className="badge">{t('plans.highlight')}</span>}
              <h3>{text.name}</h3>
              <p className="plan__price">
                {price == null ? t('plans.onRequest') : <>{fmt.format(price)}<span className="muted small">{t('plans.perPeriod')}</span></>}
              </p>
              <ul className="plan__features">
                {text.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <a
                className={`btn ${p.highlight ? 'btn--primary' : ''}`}
                href={ctaHref(p.cta, text.name)}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {text.cta}
              </a>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
