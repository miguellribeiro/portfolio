import { useI18n } from '../i18n/context.js';
import { mailtoHref, useChannel, whatsappHref } from '../engine/channels.js';
import { regionPrice, useRegion } from '../engine/region.js';

/** Props de link para o CTA: overlay → WhatsApp com categoria, plano e preço regional formatado. */
export function usePlanCta() {
  const { t } = useI18n();
  const { launch } = useChannel();
  const [region] = useRegion();
  return (cat, p) => {
    const name = t(`plans.categories.${cat.id}.plans.${p.id}.name`);
    const price = regionPrice(region, cat, p)?.text || '';
    const msg = t('contact.planMessage')
      .replace('{category}', t(`plans.categories.${cat.id}.label`))
      .replace('{plan}', name)
      .replace('{price}', price);
    return ctaProps(p.cta, msg, `${t('contact.emailSubject')} — ${name}`, launch);
  };
}

/** Monta href/onClick a partir de { type: whatsapp|email|url, href? }. */
export function ctaProps(cta, msg, subject, launch) {
  const type = cta?.type || 'whatsapp';
  if (type === 'url') return { href: cta.href || '#contact' };
  const target = type === 'email'
    ? { channel: 'email', href: mailtoHref(subject, msg), external: false }
    : { channel: 'whatsapp', href: whatsappHref(msg), external: true };
  return {
    href: target.href,
    ...(target.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
    onClick: (e) => launch(target, e),
  };
}
