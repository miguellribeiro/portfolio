import { useId, useState } from 'react';
import { useI18n } from '../i18n/context.js';
import { site } from '../engine/content.js';
import Check from './Check.jsx';
import Segmented from './Segmented.jsx';
import { usePlanCta } from '../hooks/usePlanCta.js';

/** Valor de célula: true (check), false ("—") ou "v:<id>" → plans.values.<id>. */
function Value({ v }) {
  const { t } = useI18n();
  if (v === true) return <span className="cmp__yes"><Check /><span className="sr-only">{t('plans.yes')}</span></span>;
  if (v === false || v == null) return <span className="cmp__no"><span aria-hidden="true">—</span><span className="sr-only">{t('plans.no')}</span></span>;
  const s = String(v);
  return <span className="cmp__text">{s.startsWith('v:') ? t(`plans.values.${s.slice(2)}`) : s}</span>;
}

function RowLabel({ id }) {
  const { t } = useI18n();
  const tipId = useId();
  return (
    <span className="cmp__label">
      {t(`plans.rows.${id}.label`)}
      <span className="tip">
        <button type="button" className="tip__btn" aria-describedby={tipId} aria-label="Info">i</button>
        <span role="tooltip" id={tipId} className="tip__box">{t(`plans.rows.${id}.tip`)}</span>
      </span>
    </span>
  );
}

export default function PlansCompare({ billing }) {
  const { t } = useI18n();
  const cta = usePlanCta();
  const cats = site.plansConfig.compare.categories;
  const plans = site.plans;
  const [open, setOpen] = useState(false);
  const [closed, setClosed] = useState(() => new Set());
  const [tab, setTab] = useState(plans.find((p) => p.highlight)?.id || plans[0].id);
  const toggleCat = (id) => setClosed((s) => {
    const n = new Set(s);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });

  return (
    <div className="cmp">
      <button type="button" className="btn btn--ghost cmp__toggle" aria-expanded={open} aria-controls="cmp-panel" onClick={() => setOpen((o) => !o)}>
        {open ? t('plans.compareHide') : t('plans.compareToggle')}
        <span className="cmp__chev" aria-hidden="true" />
      </button>

      <div id="cmp-panel" className="cmp__panel" hidden={!open}>
        {/* Desktop: tabela com cabeçalho fixo */}
        <table className="cmp__table">
          <caption className="sr-only">{t('plans.compareTitle')}</caption>
          <thead>
            <tr>
              <th scope="col" className="cmp__corner">{t('plans.feature')}</th>
              {plans.map((p) => (
                <th key={p.id} scope="col" className={p.highlight ? 'is-hl' : ''}>
                  <span className="cmp__plan">{t(`plans.items.${p.id}.name`)}</span>
                  <a className={`btn btn--xs ${p.highlight ? 'btn--highlight' : 'btn--ghost'}`} {...cta(p, billing)}>{t('plans.choose')}</a>
                </th>
              ))}
            </tr>
          </thead>
          {cats.map((c) => {
            const isOpen = !closed.has(c.id);
            return (
              <tbody key={c.id} className="cmp__group">
                <tr className="cmp__cat">
                  <th colSpan={plans.length + 1} scope="colgroup">
                    <button type="button" aria-expanded={isOpen} onClick={() => toggleCat(c.id)}>
                      <span className="cmp__chev" aria-hidden="true" />{t(`plans.categories.${c.id}`)}
                    </button>
                  </th>
                </tr>
                {isOpen && c.rows.map((r) => (
                  <tr key={r.id} className="cmp__row">
                    <th scope="row"><RowLabel id={r.id} /></th>
                    {plans.map((p) => <td key={p.id} className={p.highlight ? 'is-hl' : ''}><Value v={r.values?.[p.id]} /></td>)}
                  </tr>
                ))}
              </tbody>
            );
          })}
        </table>

        {/* Mobile: abas por plano */}
        <div className="cmp__mobile">
          <Segmented
            id="cmp-tabs"
            size="sm"
            className="cmp__tabs"
            label={t('plans.compareTitle')}
            value={tab}
            onChange={setTab}
            options={plans.map((p) => ({ value: p.id, label: t(`plans.items.${p.id}.name`) }))}
          />
          {cats.map((c) => (
            <section key={c.id} className="cmp__mcat" aria-label={t(`plans.categories.${c.id}`)}>
              <h4>{t(`plans.categories.${c.id}`)}</h4>
              <dl>
                {c.rows.map((r) => (
                  <div key={r.id} className="cmp__mrow">
                    <dt>{t(`plans.rows.${r.id}.label`)}</dt>
                    <dd><Value v={r.values?.[tab]} /></dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
          <a className="btn btn--highlight cmp__mcta" {...cta(plans.find((p) => p.id === tab), billing)}>
            {t(`plans.items.${tab}.cta`)} <span className="btn__arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
