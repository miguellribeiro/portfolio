import { useI18n } from '../i18n/context.js';
import Section from '../components/Section.jsx';

export default function Capabilities({ id }) {
  const { t } = useI18n();
  return (
    <Section id={id} title={t('capabilities.title')}>
      <ul className="grid grid--3">
        {t('capabilities.items').map((c) => (
          <li key={c.name} className="card">
            <h3>{c.name}</h3>
            <p className="muted">{c.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
