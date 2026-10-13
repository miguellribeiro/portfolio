import { useI18n } from '../i18n/context.js';
import { site } from '../engine/content.js';
import Section from '../components/Section.jsx';

export default function Contact({ id }) {
  const { t } = useI18n();
  const c = site.contact;
  const links = [
    c.email && { key: 'email', href: `mailto:${c.email}`, value: c.email },
    c.whatsapp && { key: 'whatsapp', href: `https://wa.me/${c.whatsapp}`, value: `+${c.whatsapp}` },
    c.github && { key: 'github', href: c.github, value: c.github.replace(/^https?:\/\//, '') },
    c.linkedin && { key: 'linkedin', href: c.linkedin, value: c.linkedin.replace(/^https?:\/\//, '') },
  ].filter(Boolean);
  return (
    <Section id={id} title={t('contact.title')} subtitle={t('contact.subtitle')}>
      <ul className="grid grid--2 contact">
        {links.map((l) => (
          <li key={l.key}>
            <a className="card contact__link" href={l.href} target={l.key === 'email' ? undefined : '_blank'} rel="noopener noreferrer">
              <strong>{t(`contact.${l.key}`)}</strong>
              <span className="muted">{l.value}</span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
