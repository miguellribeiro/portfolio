import { useRef } from 'react';
import { useScroll } from 'motion/react';
import * as M from 'motion/react-m';
import { useI18n } from '../i18n/context.js';
import Section from '../components/Section.jsx';

/** Timeline com cabeçalho sticky e barra de progresso ligada ao scroll. */
export default function Experience({ id }) {
  const { t } = useI18n();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 50%'] });
  return (
    <Section id={id} title={t('experience.title')} layout="split">
      <div className="timeline-wrap" ref={ref}>
        <div className="timeline__rail" aria-hidden="true">
          <M.div className="timeline__progress" style={{ scaleY: scrollYProgress }} />
        </div>
        <ol className="timeline">
          {t('experience.items').map((e, i) => (
            <li key={i} className="timeline__item reveal" style={{ '--i': i }}>
              <p className="timeline__period mono">{e.period}</p>
              <h3>{e.role} <span className="muted">· {e.org}</span></h3>
              <p>{e.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
