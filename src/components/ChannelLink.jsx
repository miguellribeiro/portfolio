import { useState } from 'react';
import { useChannel } from '../engine/channels.js';
import { useI18n } from '../i18n/context.js';
import { useCardFx } from '../hooks/useCardFx.js';
import BrandIcon from './BrandIcon.jsx';

/** Link de canal: <a> real (funciona sem JS / com reduced motion) + overlay de abertura. */
export function ChannelAnchor({ ch, className = '', children, ...rest }) {
  const { launch } = useChannel();
  return (
    <a
      className={className}
      href={ch.href}
      data-channel={ch.key}
      {...(ch.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onClick={(e) => launch({ channel: ch.key, href: ch.href, external: ch.external }, e)}
      {...rest}
    >
      {children}
    </a>
  );
}

/** Card de contato com ícone, valor, dica e botão de copiar (e-mail/telefone). */
export default function ChannelCard({ ch, i = 0 }) {
  const { t } = useI18n();
  const fx = useCardFx();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ch.copy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* sem permissão: o valor continua visível para copiar manualmente */ }
  };
  return (
    <li className={`chan card reveal ${fx.className}`} data-channel={ch.key} style={{ '--i': i }} onPointerMove={fx.onPointerMove} onPointerLeave={fx.onPointerLeave}>
      <ChannelAnchor ch={ch} className="chan__link">
        <span className="chan__icon"><BrandIcon name={ch.key} size={24} /></span>
        <span className="chan__text">
          <strong>{t(`contact.${ch.key}`)}</strong>
          <span className="chan__value">{ch.value}</span>
          <span className="chan__hint">{t(`contact.hint.${ch.key}`)}</span>
        </span>
        <span className="chan__arrow" aria-hidden="true">↗</span>
      </ChannelAnchor>
      {ch.copy && (
        <button type="button" className="chan__copy" onClick={copy} aria-label={`${t('contact.copy')}: ${ch.value}`}>
          <BrandIcon name={copied ? 'check' : 'copy'} size={16} />
          <span aria-live="polite">{copied ? t('contact.copied') : t('contact.copy')}</span>
        </button>
      )}
    </li>
  );
}
