import { useI18n } from '../i18n/context.js';
import Section from '../components/Section.jsx';

export default function Testimonials({ id }) {
  const { t } = useI18n();
  return (
    <Section id={id} title={t('testimonials.title')}>
      <div className="grid grid--2">
        {t('testimonials.items').map((q, i) => (
          <figure key={i} className="card quote reveal" style={{ '--i': i }}>
            <blockquote>“{q.quote}”</blockquote>
            <figcaption className="muted">— {q.author}, {q.role}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
