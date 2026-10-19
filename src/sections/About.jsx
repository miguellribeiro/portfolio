import { useI18n } from '../i18n/context.js';
import Section from '../components/Section.jsx';
import SolarSystem from '../components/SolarSystem.jsx';

export default function About({ id }) {
  const { t } = useI18n();
  return (
    <Section id={id} title={t('about.title')} className="about">
      <div className="about__wrap">
        <div className="prose">
          {t('about.paragraphs').map((p, i) => <p key={i} className="reveal" style={{ '--i': i }}>{p}</p>)}
        </div>
        <div className="about__shape">
          <SolarSystem />
        </div>
      </div>
    </Section>
  );
}
