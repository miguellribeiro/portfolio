import { useI18n } from '../i18n/context.js';
import Section from '../components/Section.jsx';
import { useCardFx } from '../hooks/useCardFx.js';

function Cap({ c, i }) {
  const fx = useCardFx();
  return (
    <li className={`card cap reveal ${fx.className}`} style={{ '--i': i }} onPointerMove={fx.onPointerMove} onPointerLeave={fx.onPointerLeave}>
      <span className="cap__num mono" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
      <h3>{c.name}</h3>
      <p className="muted">{c.description}</p>
    </li>
  );
}

export default function Capabilities({ id }) {
  const { t } = useI18n();
  return (
    <Section id={id} title={t('capabilities.title')}>
      <ul className="grid grid--3 caps">
        {t('capabilities.items').map((c, i) => <Cap key={c.name} c={c} i={i} />)}
      </ul>
    </Section>
  );
}
