import { createContext, useContext } from 'react';
import { site } from './content.js';

/** Monta o link do WhatsApp com texto pré-preenchido. */
export const whatsappHref = (text) =>
  `https://wa.me/${site.contact.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

/** Monta o mailto com assunto (e corpo opcional). */
export const mailtoHref = (subject, body) => {
  const q = new URLSearchParams();
  if (subject) q.set('subject', subject);
  if (body) q.set('body', body);
  const qs = q.toString().replace(/\+/g, '%20');
  return `mailto:${site.contact.email}${qs ? `?${qs}` : ''}`;
};

/**
 * Canais de contato (site.json → contact) com textos do idioma atual.
 * @returns {{key: 'whatsapp'|'email'|'linkedin'|'github', href: string, value: string, copy?: string, external: boolean}[]}
 */
export function getChannels(t) {
  const c = site.contact;
  return [
    c.whatsapp && { key: 'whatsapp', href: whatsappHref(t('contact.whatsappText')), value: c.whatsappDisplay || `+${c.whatsapp}`, copy: c.whatsappDisplay || `+${c.whatsapp}`, external: true },
    c.email && { key: 'email', href: mailtoHref(t('contact.emailSubject')), value: c.email, copy: c.email, external: false },
    c.linkedin && { key: 'linkedin', href: c.linkedin, value: c.linkedin.replace(/^https?:\/\/(www\.)?/, ''), external: true },
    c.github && { key: 'github', href: c.github, value: c.github.replace(/^https?:\/\//, ''), external: true },
  ].filter(Boolean);
}

export const ChannelContext = createContext({ launch: () => false });
/** launch({ channel, href, external }, event) → abre o overlay do canal; retorna true se assumiu o clique. */
export const useChannel = () => useContext(ChannelContext);
