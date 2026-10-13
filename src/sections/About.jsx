import { useI18n } from '../i18n/context.js';
import Section from '../components/Section.jsx';

export default function About({ id }) {
  const { t } = useI18n();
  return (
    <Section id={id} title={t('about.title')}>
      <div className="prose">
        {t('about.paragraphs').map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </Section>
  );
}
