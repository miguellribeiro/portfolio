import { site } from '../engine/content.js';
import { UNNUMBERED } from '../engine/sectionMeta.js';

// Calculado sob demanda (evita ler site durante o ciclo de imports content → registry → seções).
let numbered;
const numberOf = (id) => {
  numbered ||= site.sections.filter((s) => s.enabled && !UNNUMBERED.has(s.type)).map((s) => s.id);
  return numbered.indexOf(id) + 1;
};

/**
 * Seção padrão: título composto (número mono + título num único h2) e subtítulo.
 * Seções ímpares recebem fundo alternado + divisor (site.json → effects.dividers).
 * layout="split" deixa o cabeçalho fixo (sticky) à esquerda.
 */
export default function Section({ id, title, subtitle, children, className = '', layout, sectionRef, style, after }) {
  const n = numberOf(id);
  const alt = n > 0 && n % 2 === 0;
  return (
    <section
      id={id}
      className={`section ${alt ? 'section--alt' : ''} ${layout ? `section--${layout}` : ''} ${className}`}
      aria-labelledby={`${id}-title`}
      ref={sectionRef}
      style={style}
    >
      <div className="container section__inner">
        <header className="section__head reveal">
          <h2 id={`${id}-title`} className="section__title">
            {n > 0 && <span className="section__num mono" aria-hidden="true">{String(n).padStart(2, '0')}</span>}
            <span>{title}</span>
          </h2>
          {subtitle && <p className="muted">{subtitle}</p>}
        </header>
        <div className="section__body">{children}</div>
      </div>
      {after}
    </section>
  );
}
