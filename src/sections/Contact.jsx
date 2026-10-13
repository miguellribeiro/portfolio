import { useI18n } from '../i18n/context.js';
import { site } from '../engine/content.js';
import Section from '../components/Section.jsx';
import { useCardFx } from '../hooks/useCardFx.js';

function ContactLink({ l, i, label }) {
  const fx = useCardFx();
  return (
    <li className="reveal" style={{ '--i': i }}>
      <a
        className={`card contact__link ${fx.className}`}
        onPointerMove={fx.onPointerMove}
        onPointerLeave={fx.onPointerLeave}
        href={l.href}
        target={l.key === 'email' ? undefined : '_blank'}
        rel="noopener noreferrer"
      >
        <strong className="mono">{label}</strong>
        <span className="muted">{l.value}</span>
        <span className="contact__arrow" aria-hidden="true">↗</span>
      </a>
    </li>
  );
}

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
    <Section id={id} title={t('contact.title')} subtitle={t('contact.subtitle')} className="contact">
      <ul className="grid grid--2">
        {links.map((l, i) => <ContactLink key={l.key} l={l} i={i} label={t(`contact.${l.key}`)} />)}
      </ul>
    </Section>
  );
}
