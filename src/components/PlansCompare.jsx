import { Fragment, useId, useState } from 'react';
import { useI18n } from '../i18n/context.js';
import Check from './Check.jsx';
import Segmented from './Segmented.jsx';
import { usePlanCta } from '../hooks/usePlanCta.js';
import { regionPrice, useRegion, withDomainFee } from '../engine/region.js';

/** Célula: true (check), false ("—"), "v:<id>" → plans.values.<id>, "price" → mensalidade. */
function Value({ v, plan, cat }) {
  const { t } = useI18n();
  const [region] = useRegion();
  if (v === true) return <span className="cmp__yes"><Check /><span className="sr-only">{t('plans.yes')}</span></span>;
  if (v === false || v == null) return <span className="cmp__no"><span aria-hidden="true">—</span><span className="sr-only">{t('plans.no')}</span></span>;
  if (v === 'price') {
    const pr = regionPrice(region, cat, plan);
    if (!pr) return <span className="cmp__no">—</span>;
    return <span className="cmp__text mono">{pr.text}<span className="cmp__per">{t('plans.period')}</span></span>;
  }
  const s = String(v);
  return <span className="cmp__text">{s.startsWith('v:') ? t(`plans.values.${s.slice(2)}`) : s}</span>;
}

function Sup({ notes }) {
  if (!notes?.length) return null;
  return (
    <sup className="cmp__sup">
      {notes.map((n, i) => <Fragment key={n}>{i > 0 && <span aria-hidden="true">,</span>}<a href={`#fn-${n}`} aria-label={`nota ${n}`}>{n}</a></Fragment>)}
    </sup>
  );
}

function RowLabel({ row }) {
  const { t } = useI18n();
  const tipId = useId();
  return (
    <span className="cmp__label">
      {t(`plans.rows.${row.id}.label`)}<Sup notes={row.footnotes} />
      <span className="tip">
        <button type="button" className="tip__btn" aria-describedby={tipId} aria-label="Info">i</button>
        <span role="tooltip" id={tipId} className="tip__box">{t(`plans.rows.${row.id}.tip`)}</span>
      </span>
    </span>
  );
}

/** Tabela comparativa de uma categoria (desktop) + abas por plano (mobile). */
export default function PlansCompare({ cat, notes }) {
  const { t } = useI18n();
  const cta = usePlanCta();
  const plans = cat.plans;
  const groups = cat.compare?.groups || [];
  const name = (p) => t(`plans.categories.${cat.id}.plans.${p.id}.name`);
  const [open, setOpen] = useState(false);
  const [closed, setClosed] = useState(() => new Set());
  const [tab, setTab] = useState(plans.find((p) => p.highlight)?.id || plans[0].id);
  const tabPlan = plans.find((p) => p.id === tab) || plans[0];
  const toggle = (id) => setClosed((s) => {
    const n = new Set(s);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });
  const panelId = `cmp-${cat.id}`;

  return (
    <div className="cmp">
      <button type="button" className="btn btn--ghost cmp__toggle" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((o) => !o)}>
        {open ? t('plans.compareHide') : t('plans.compareToggle')}
        <span className="cmp__chev" aria-hidden="true" />
      </button>

      <div id={panelId} className="cmp__panel" hidden={!open}>
        <table className="cmp__table" style={{ '--cols': plans.length }}>
          <caption className="sr-only">{t('plans.compareTitle')} — {t(`plans.categories.${cat.id}.label`)}</caption>
          <thead>
            <tr>
              <th scope="col" className="cmp__corner">{t('plans.feature')}</th>
              {plans.map((p) => (
                <th key={p.id} scope="col" className={p.highlight ? 'is-hl' : ''}>
                  <span className="cmp__plan">{name(p)}</span>
                  <a className={`btn btn--xs ${p.highlight ? 'btn--highlight' : 'btn--ghost'}`} {...cta(cat, p)}>{t('plans.choose')}</a>
                </th>
              ))}
            </tr>
          </thead>
          {groups.map((g) => {
            const isOpen = !closed.has(g.id);
            return (
              <tbody key={g.id} className="cmp__group">
                <tr className="cmp__cat">
                  <th colSpan={plans.length + 1} scope="colgroup">
                    <button type="button" aria-expanded={isOpen} onClick={() => toggle(g.id)}>
                      <span className="cmp__chev" aria-hidden="true" />{t(`plans.groups.${g.id}`)}
                    </button>
                  </th>
                </tr>
                {isOpen && g.rows.map((r) => (
                  <tr key={r.id} className="cmp__row">
                    <th scope="row"><RowLabel row={r} /></th>
                    {plans.map((p) => <td key={p.id} className={p.highlight ? 'is-hl' : ''}><Value v={r.values?.[p.id]} plan={p} cat={cat} /></td>)}
                  </tr>
                ))}
              </tbody>
            );
          })}
        </table>

        <div className="cmp__mobile">
          <Segmented
            id={`cmp-tabs-${cat.id}`}
            size="sm"
            className="cmp__tabs"
            label={t('plans.compareTitle')}
            value={tab}
            onChange={setTab}
            options={plans.map((p) => ({ value: p.id, label: name(p) }))}
          />
          {groups.map((g) => (
            <section key={g.id} className="cmp__mcat" aria-label={t(`plans.groups.${g.id}`)}>
              <h4>{t(`plans.groups.${g.id}`)}</h4>
              <dl>
                {g.rows.map((r) => (
                  <div key={r.id} className="cmp__mrow">
                    <dt>{t(`plans.rows.${r.id}.label`)}<Sup notes={r.footnotes} /></dt>
                    <dd><Value v={r.values?.[tab]} plan={tabPlan} cat={cat} /></dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
          <a className="btn btn--highlight cmp__mcta" {...cta(cat, tabPlan)}>
            {t('plans.cta')}: {name(tabPlan)} <span className="btn__arrow" aria-hidden="true">→</span>
          </a>
        </div>

        <Footnotes ids={notes} />
      </div>
    </div>
  );
}

/** Notas ¹² (plansConfig.footnotes → plans.footnotes.<n>). */
export function Footnotes({ ids }) {
  const { t } = useI18n();
  const [region] = useRegion();
  const list = ids || ['1', '2'];
  return (
    <ol className="cmp__notes small">
      {list.map((n) => <li key={n} id={`fn-${n}`}><sup>{n}</sup> {withDomainFee(t(`plans.footnotes.${n}`), region, t)}</li>)}
    </ol>
  );
}
