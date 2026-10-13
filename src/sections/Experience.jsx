import { useI18n } from '../i18n/context.js';
import Section from '../components/Section.jsx';

export default function Experience({ id }) {
  const { t } = useI18n();
  return (
    <Section id={id} title={t('experience.title')}>
      <ol className="timeline">
        {t('experience.items').map((e, i) => (
          <li key={i} className="timeline__item">
            <p className="muted small">{e.period}</p>
            <h3>{e.role} · <span className="muted">{e.org}</span></h3>
            <p>{e.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
