import { useI18n } from '../i18n/context.js';
import { site } from '../engine/content.js';
import Section from '../components/Section.jsx';
import { useCardFx } from '../hooks/useCardFx.js';

function ctaHref(cta, label) {
  const c = site.contact;
  if (cta.type === 'whatsapp') return `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(label)}`;
  if (cta.type === 'email') return `mailto:${c.email}?subject=${encodeURIComponent(label)}`;
  return cta.href || '#contact';
}

function Plan({ p, i, fmt }) {
  const { t, currency } = useI18n();
  const fx = useCardFx();
  const text = t(`plans.items.${p.id}`);
  const price = p.prices?.[currency];
  const external = p.cta.type !== 'email';
  return (
    <article
      className={`card plan reveal ${p.highlight ? 'plan--highlight' : ''} ${fx.className}`}
      style={{ '--i': i }}
      onPointerMove={fx.onPointerMove}
      onPointerLeave={fx.onPointerLeave}
    >
      {p.highlight && <span className="badge badge--grad mono">{t('plans.highlight')}</span>}
      <h3>{text.name}</h3>
      <p className="plan__price">
        {price == null ? t('plans.onRequest') : <>{fmt.format(price)}<span className="muted small">{t('plans.perPeriod')}</span></>}
      </p>
      <ul className="plan__features">
        {text.features.map((f) => <li key={f}>{f}</li>)}
      </ul>
      <a
        className={`btn ${p.highlight ? 'btn--highlight' : 'btn--ghost'}`}
        href={ctaHref(p.cta, text.name)}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {text.cta}
      </a>
    </article>
  );
}

export default function Plans({ id }) {
  const { t, locale, currency } = useI18n();
  const fmt = new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 });
  return (
    <Section id={id} title={t('plans.title')} subtitle={t('plans.subtitle')}>
      <div className="grid grid--3 plans">
        {site.plans.map((p, i) => <Plan key={p.id} p={p} i={i} fmt={fmt} />)}
      </div>
    </Section>
  );
}
