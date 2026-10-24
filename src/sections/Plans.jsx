import { useState } from 'react';
import { useI18n } from '../i18n/context.js';
import { site } from '../engine/content.js';
import { useChannel } from '../engine/channels.js';
import Section from '../components/Section.jsx';
import Segmented from '../components/Segmented.jsx';
import Check from '../components/Check.jsx';
import PlansCompare from '../components/PlansCompare.jsx';
import Breakable from '../components/Breakable.jsx';
import { useCardFx } from '../hooks/useCardFx.js';
import { useMagnetic } from '../hooks/useMagnetic.js';
import { ctaProps, usePlanCta } from '../hooks/usePlanCta.js';
import RegionSelect from '../components/RegionSelect.jsx';
import { regionPrice, useRegion, withDomainFee } from '../engine/region.js';

const cfg = () => site.plansConfig || {};

function PlanCard({ cat, p, i }) {
  const { t } = useI18n();
  const [region] = useRegion();
  const fx = useCardFx();
  const magnetic = useMagnetic();
  const cta = usePlanCta();
  const text = t(`plans.categories.${cat.id}.plans.${p.id}`);
  const price = regionPrice(region, cat, p);
  const hid = `plan-${cat.id}-${p.id}`;
  return (
    <article
      className={`card plan reveal ${p.highlight ? 'plan--highlight' : ''} ${fx.className}`}
      style={{ '--i': i }}
      onPointerMove={fx.onPointerMove}
      onPointerLeave={fx.onPointerLeave}
      aria-labelledby={hid}
    >
      {p.highlight && <span className="badge badge--grad mono">{t('plans.highlight')}</span>}
      <h3 id={hid}>{text.name}</h3>
      <p className="plan__audience">{text.audience}</p>
      <div className="plan__price">
        {price && (
          <>
            <span className="plan__amount mono">{price.text}</span>
            <span className="plan__period">{t('plans.period')}</span>
          </>
        )}
      </div>
      <p className="plan__note mono">{t('plans.priceNote')}</p>
      {p.inherits && <p className="plan__inherits mono">{t('plans.everything')}</p>}
      <ul className="plan__features">
        {text.features.map((f) => <li key={f}><Check /><span><Breakable text={f} /></span></li>)}
      </ul>
      <a className={`btn ${p.highlight ? 'btn--highlight' : 'btn--ghost'}`} {...cta(cat, p)} {...magnetic}>
        {t('plans.cta')} <span className="btn__arrow" aria-hidden="true">→</span>
      </a>
    </article>
  );
}

function CustomBand() {
  const { t } = useI18n();
  const { launch } = useChannel();
  const magnetic = useMagnetic();
  const c = cfg().customBand;
  if (!c) return null;
  return (
    <div className="custom-band reveal">
      <div>
        <h3>{t('plans.custom.title')}</h3>
        <p className="muted">{t('plans.custom.text')}</p>
      </div>
      <a className="btn btn--primary" {...ctaProps(c.cta, t('plans.custom.message'), `${t('contact.emailSubject')} — ${t('plans.custom.title')}`, launch)} {...magnetic}>
        {t('plans.custom.cta')} <span className="btn__arrow" aria-hidden="true">→</span>
      </a>
    </div>
  );
}

/**
 * Aviso no lugar de uma categoria oculta (site.json → categories[].hidden + notice).
 * Textos em plans.categories.<id>.notice.{title,text,cta,message}.
 */
function HiddenNotice({ cat }) {
  const { t } = useI18n();
  const { launch } = useChannel();
  const magnetic = useMagnetic();
  const k = `plans.categories.${cat.id}.notice`;
  const hid = `notice-${cat.id}`;
  return (
    <aside className="plan-notice reveal" aria-labelledby={hid}>
      <div>
        <h3 id={hid}>{t(`${k}.title`)}</h3>
        <p className="muted">{t(`${k}.text`)}</p>
      </div>
      <a className="btn btn--ghost" {...ctaProps(cat.notice.cta, t(`${k}.message`), `${t('contact.emailSubject')} — ${t(`${k}.title`)}`, launch)} {...magnetic}>
        {t(`${k}.cta`)} <span className="btn__arrow" aria-hidden="true">→</span>
      </a>
    </aside>
  );
}

export default function Plans({ id }) {
  const { t } = useI18n();
  const [region] = useRegion();
  const c = cfg();
  const all = c.categories || [];
  // hidden: true tira a categoria da página (abas, grade, comparativo) sem apagar os dados.
  const cats = all.filter((x) => !x.hidden);
  const notices = all.filter((x) => x.hidden && x.notice);
  const [catId, setCatId] = useState(cats[0]?.id);
  const cat = cats.find((x) => x.id === catId) || cats[0];
  if (!cat) return null;
  const notes = (c.footnotes || []).map(String);

  return (
    <Section id={id} title={t('plans.title')} subtitle={t(cats.length > 1 ? 'plans.subtitle' : 'plans.subtitleSingle')} className="plans-section">
      <div className="plans__bar reveal">
        {cats.length > 1 && (
          <Segmented
            id="plan-cat"
            label={t('plans.categoryLabel')}
            value={cat.id}
            onChange={setCatId}
            className="plans__tabs"
            options={cats.map((x) => ({ value: x.id, label: t(`plans.categories.${x.id}.label`) }))}
          />
        )}
        <div className="plans__region">
          <RegionSelect />
          {region && region.currency !== 'BRL' && <p className="plans__note mono">{t('plans.currencyNote').replace('{currency}', region.currency)}</p>}
        </div>
      </div>

      <div key={`grid-${cat.id}`} className={`plans-grid plans-grid--${cat.plans.length}`} style={{ '--n': cat.plans.length }}>
        {cat.plans.map((p, i) => <PlanCard key={p.id} cat={cat} p={p} i={i} />)}
      </div>

      {notices.map((x) => <HiddenNotice key={x.id} cat={x} />)}

      {!(c.customBand?.mergeIntoNotice && notices.length) && <CustomBand />}

      {c.trust?.length > 0 && (
        <ul className="trust reveal" aria-label={t('plans.trustLabel')}>
          {c.trust.map((k) => <li key={k}><Check />{t(`plans.trust.${k}`)}</li>)}
        </ul>
      )}

      {cat.compare?.groups?.length > 0 && <PlansCompare key={`cmp-${cat.id}`} cat={cat} notes={notes} />}

      {c.disclaimer && <p className="plans__disclaimer small">{t('plans.disclaimer')}</p>}

      {c.faq?.length > 0 && (
        <div className="faq">
          <h3 className="faq__title">{t('plans.faqTitle')}</h3>
          <div className="faq__list">
            {c.faq.map((k, i) => (
              <details key={k} className="faq__item reveal" style={{ '--i': i % 4 }}>
                <summary>{t(`plans.faq.${k}.q`)}<span className="faq__icon" aria-hidden="true" /></summary>
                <p><Breakable text={withDomainFee(t(`plans.faq.${k}.a`), region, t)} /></p>
              </details>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
