import { useState } from 'react';
import { useI18n } from '../i18n/context.js';
import { site } from '../engine/content.js';
import Section from '../components/Section.jsx';
import Segmented from '../components/Segmented.jsx';
import Check from '../components/Check.jsx';
import PlansCompare from '../components/PlansCompare.jsx';
import { useCardFx } from '../hooks/useCardFx.js';
import { priceFor, usePlanCta } from '../hooks/usePlanCta.js';

const cfg = () => site.plansConfig || {};

function PlanCard({ p, i, billing, fmt }) {
  const { t, currency } = useI18n();
  const fx = useCardFx();
  const cta = usePlanCta();
  const text = t(`plans.items.${p.id}`);
  const price = priceFor(p, billing, currency);
  return (
    <article
      className={`card plan reveal ${p.highlight ? 'plan--highlight' : ''} ${fx.className}`}
      style={{ '--i': i }}
      onPointerMove={fx.onPointerMove}
      onPointerLeave={fx.onPointerLeave}
      aria-labelledby={`plan-${p.id}`}
    >
      {p.highlight && <span className="badge badge--grad mono">{t('plans.highlight')}</span>}
      <h3 id={`plan-${p.id}`}>{text.name}</h3>
      <p className="plan__audience">{text.audience}</p>
      <div className="plan__price">
        {price ? (
          <>
            <span className="plan__from">{t('plans.from')}</span>
            <span className="plan__amount mono">{fmt.format(price.value)}</span>
            <span className="plan__period">{t(`plans.period.${price.mode}`)}</span>
            {price.fallback && (
              <span className="plan__fallback">{t('plans.onlyOther').replace('{mode}', t(`plans.billing.${price.mode}`).toLowerCase())}</span>
            )}
          </>
        ) : (
          <span className="plan__amount plan__amount--text">{t('plans.onRequest')}</span>
        )}
      </div>
      {p.inherits && <p className="plan__inherits mono">{t('plans.everything')}</p>}
      <ul className="plan__features">
        {text.features.map((f) => <li key={f}><Check />{f}</li>)}
      </ul>
      <a className={`btn ${p.highlight ? 'btn--highlight' : 'btn--ghost'}`} {...cta(p, billing)}>
        {text.cta} <span className="btn__arrow" aria-hidden="true">→</span>
      </a>
    </article>
  );
}

export default function Plans({ id }) {
  const { t, locale, currency } = useI18n();
  const c = cfg();
  const options = c.billing?.options || ['project', 'monthly'];
  const [billing, setBilling] = useState(c.billing?.default || options[0]);
  const fmt = new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 });
  return (
    <Section id={id} title={t('plans.title')} subtitle={t('plans.subtitle')} className="plans-section">
      <div className="plans__bar reveal">
        {options.length > 1 && (
          <Segmented
            id="billing"
            label={t('plans.billing.label')}
            value={billing}
            onChange={setBilling}
            options={options.map((o) => ({ value: o, label: t(`plans.billing.${o}`) }))}
          />
        )}
        <p className="plans__note mono">
          {t('plans.currencyNote').replace('{currency}', currency)}
          {c.examplePrices && <> <strong className="plans__example">{t('plans.exampleNote')}</strong></>}
        </p>
      </div>

      <div className="plans-grid" style={{ '--n': site.plans.length }}>
        {site.plans.map((p, i) => <PlanCard key={p.id} p={p} i={i} billing={billing} fmt={fmt} />)}
      </div>

      {c.trust?.length > 0 && (
        <ul className="trust reveal" aria-label={t('plans.trustLabel')}>
          {c.trust.map((k) => <li key={k}><Check />{t(`plans.trust.${k}`)}</li>)}
        </ul>
      )}

      {c.compare?.categories?.length > 0 && <PlansCompare billing={billing} />}

      {c.faq?.length > 0 && (
        <div className="faq">
          <h3 className="faq__title">{t('plans.faqTitle')}</h3>
          <div className="faq__list">
            {c.faq.map((k) => (
              <details key={k} className="faq__item">
                <summary>{t(`plans.faq.${k}.q`)}<span className="faq__icon" aria-hidden="true" /></summary>
                <p>{t(`plans.faq.${k}.a`)}</p>
              </details>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
