import { useI18n } from '../i18n/context.js';
import Section from '../components/Section.jsx';

export default function About({ id }) {
  const { t } = useI18n();
  return (
    <Section id={id} title={t('about.title')} className="about">
      <div className="about__wrap">
        <div className="prose">
          {t('about.paragraphs').map((p, i) => <p key={i} className="reveal" style={{ '--i': i }}>{p}</p>)}
        </div>
        <div className="about__shape" aria-hidden="true">
          <span className="shape shape--ring" />
          <span className="shape shape--square" />
          <span className="shape shape--dot" />
        </div>
      </div>
    </Section>
  );
}
