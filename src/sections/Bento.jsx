import { useI18n } from '../i18n/context.js';
import { site } from '../engine/content.js';
import { useEffects } from '../engine/effects.js';
import Section from '../components/Section.jsx';
import Counter from '../components/Counter.jsx';
import Icon from '../components/Icon.jsx';
import { useCardFx } from '../hooks/useCardFx.js';

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
          <h3 className="bento__label">{t(`stats.items.${r.id}`)}</h3>
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

/** Bento: números (stats) + diferenciais (capabilities) numa grade de caixas de tamanhos variados. */
export default function Bento({ id }) {
  const { t } = useI18n();
  const items = site.bento?.items || [];
  if (!items.length) return null;
  return (
    <Section id={id} title={t('bento.title')} subtitle={t('bento.subtitle')} className="bento-section">
      <ul className="bento">
        {items.map((it, i) => <Box key={it.ref} item={it} i={i} />)}
      </ul>
    </Section>
  );
}
