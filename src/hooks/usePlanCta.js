import { useI18n } from '../i18n/context.js';
import { mailtoHref, useChannel, whatsappHref } from '../engine/channels.js';

/** Preço do plano para o modo/moeda. Aceita o formato antigo (prices = por projeto). */
export function priceFor(p, billing, currency) {
  const project = p.prices?.[currency];
  const monthly = p.pricesMonthly?.[currency];
  const want = billing === 'monthly' ? monthly : project;
  if (want != null) return { value: want, mode: billing };
  const other = billing === 'monthly' ? project : monthly;
  if (other != null) return { value: other, mode: billing === 'monthly' ? 'project' : 'monthly', fallback: true };
  return null;
}

/** Destino do CTA (WhatsApp com plano + modo + moeda, e-mail ou URL). */
export function usePlanCta() {
  const { t, currency } = useI18n();
  const { launch } = useChannel();
  return (p, billing) => {
    const name = t(`plans.items.${p.id}.name`);
    const msg = t('contact.planMessage')
      .replace('{plan}', name)
      .replace('{billing}', t(`plans.billing.${billing}`))
      .replace('{currency}', currency);
    const type = p.cta?.type || 'whatsapp';
    const target = type === 'email'
      ? { channel: 'email', href: mailtoHref(`${t('contact.emailSubject')} — ${name}`, msg), external: false }
      : type === 'url'
        ? { channel: 'whatsapp', href: p.cta.href || '#contact', external: true }
        : { channel: 'whatsapp', href: whatsappHref(msg), external: true };
    return {
      href: target.href,
      ...(target.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
      onClick: (e) => { if (type !== 'url') launch(target, e); },
    };
  };
}
