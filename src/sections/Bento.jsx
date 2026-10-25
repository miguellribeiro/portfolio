import { useI18n } from '../i18n/context.js';
import { site } from '../engine/content.js';
import { useEffects } from '../engine/effects.js';
import Section from '../components/Section.jsx';
import Counter from '../components/Counter.jsx';
import Icon from '../components/Icon.jsx';
import { useCardFx } from '../hooks/useCardFx.js';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { MOBILE_BENTO } from '../engine/breakpoints.js';

/** Resolve "stat:<id>" / "cap:<id>" (site.json → bento.items[].ref). */
export function resolveRef(ref) {
  const [kind, id] = String(ref).split(':');
  if (kind === 'stat') return { kind, id, stat: (site.stats || []).find((s) => s.id === id) };
  if (kind === 'cap') return { kind, id, ok: (site.capabilities || []).includes(id) };
  return { kind };
}

function Box({ item, i }) {
  const { t, locale } = useI18n();
  const fx = useEffects();
  const card = useCardFx();
  const r = resolveRef(item.ref);
  if ((r.kind === 'stat' && !r.stat) || (r.kind === 'cap' && !r.ok)) return null;
  const size = item.size || 'sm';
  return (
    <li
      className={`bento__box bento__box--${size} bento__box--${r.kind} card reveal ${card.className}`}
      style={{ '--i': i }}
      onPointerMove={card.onPointerMove}
      onPointerLeave={card.onPointerLeave}
    >
      <span className="bento__icon"><Icon name={item.icon} size={size === 'xl' ? 30 : 22} /></span>
      {r.kind === 'stat' ? (
        <div className="bento__stat">
          <Counter stat={r.stat} animate={fx.counters} locale={locale} className="bento__value" />
          <p className="bento__label">{t(`stats.items.${r.id}`)}</p>
        </div>
      ) : (
        <div className="bento__cap">
          <h3>{t(`capabilities.items.${r.id}.name`)}</h3>
          <p className="muted">{t(`capabilities.items.${r.id}.description`)}</p>
        </div>
      )}
      {size === 'xl' && <span className="bento__glow" aria-hidden="true" />}
    </li>
  );
}

/** Mobile: os stats pequenos viram uma faixa única de 3 colunas (número em cima, rótulo embaixo, sem ícone). */
function StatStrip({ items, i }) {
  const { t, locale } = useI18n();
  const fx = useEffects();
  const card = useCardFx();
  const rows = items.map((it) => resolveRef(it.ref)).filter((r) => r.stat);
  if (!rows.length) return null;
  return (
    <li className={`bento__box bento__strip card reveal ${card.className}`} style={{ '--i': i }} onPointerMove={card.onPointerMove} onPointerLeave={card.onPointerLeave}>
      <ul className="bento__strip-list">
        {rows.map((r) => (
          <li key={r.id} className="bento__strip-item">
            <Counter stat={r.stat} animate={fx.counters} locale={locale} className="bento__value" />
            <p className="bento__label">{t(`stats.items.${r.id}`)}</p>
          </li>
        ))}
      </ul>
    </li>
  );
}

/** Mobile: descriptionShort quando existir no locale; senão a descrição completa. */
function shortDesc(t, id) {
  const key = `capabilities.items.${id}.descriptionShort`;
  const v = t(key);
  return v && v !== key ? v : t(`capabilities.items.${id}.description`);
}

/** Mobile: os diferenciais viram um único card com lista (ícone 36px, título, descrição em até 2 linhas). */
function CapList({ items, i }) {
  const { t } = useI18n();
  const card = useCardFx();
  const rows = items.map((it) => ({ it, r: resolveRef(it.ref) })).filter(({ r }) => r.ok);
  if (!rows.length) return null;
  return (
    <li className={`bento__box bento__caps card reveal ${card.className}`} style={{ '--i': i }} onPointerMove={card.onPointerMove} onPointerLeave={card.onPointerLeave}>
      <ul className="bento__cap-list">
        {rows.map(({ it, r }) => (
          <li key={r.id} className="bento__cap-row">
            <span className="bento__icon"><Icon name={it.icon} size={18} /></span>
            <div className="bento__cap">
              <h3>{t(`capabilities.items.${r.id}.name`)}</h3>
              <p className="muted">{shortDesc(t, r.id)}</p>
            </div>
          </li>
        ))}
      </ul>
    </li>
  );
}

/** Bento: números (stats) + diferenciais (capabilities) numa grade de caixas de tamanhos variados. */
export default function Bento({ id }) {
  const { t } = useI18n();
  const compact = useMediaQuery(MOBILE_BENTO);
  const items = site.bento?.items || [];
  if (!items.length) return null;
  // ≤ 680px (MOBILE_BENTO): destaque grande → faixa de stats → lista de diferenciais.
  const xl = items.filter((it) => it.size === 'xl');
  const stats = items.filter((it) => it.size !== 'xl' && String(it.ref).startsWith('stat:'));
  const caps = items.filter((it) => it.size !== 'xl' && String(it.ref).startsWith('cap:'));
  return (
    <Section id={id} title={t('bento.title')} subtitle={t('bento.subtitle')} className="bento-section">
      {compact ? (
        <ul className="bento bento--compact">
          {xl.map((it, i) => <Box key={it.ref} item={it} i={i} />)}
          <StatStrip items={stats} i={xl.length} />
          <CapList items={caps} i={xl.length + 1} />
        </ul>
      ) : (
        <ul className="bento">
          {items.map((it, i) => <Box key={it.ref} item={it} i={i} />)}
        </ul>
      )}
    </Section>
  );
}
