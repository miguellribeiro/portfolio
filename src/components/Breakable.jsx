import { Fragment } from 'react';

// Domínios/URLs (ex.: seunegocio.manpestudio.com.br): tokens longos sem espaço.
const DOMAIN = /((?:https?:\/\/)?[\w-]+(?:\.[\w-]+){2,}(?:\/\S*)?)/i;

/**
 * Texto com domínios quebráveis: o domínio vira um span "código" com <wbr> após
 * cada ponto, para quebrar linha dentro de cards estreitos em vez de vazar.
 */
export default function Breakable({ text }) {
  const parts = String(text).split(DOMAIN);
  if (parts.length === 1) return text;
  return parts.map((part, i) => (i % 2
    ? (
      <span key={i} className="url mono">
        {part.split('.').map((seg, j) => <Fragment key={j}>{j > 0 && <>.<wbr /></>}{seg}</Fragment>)}
      </span>
    )
    : part));
}
