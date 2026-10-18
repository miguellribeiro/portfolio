import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/context.js';
import { site } from '../engine/content.js';
import { useEffects } from '../engine/effects.js';
import Section from '../components/Section.jsx';
import Icon from '../components/Icon.jsx';

const ICONS = ['chat', 'pen', 'code', 'rocket'];

/**
 * "Como funciona": stepper interativo (tablist). Clique/setas trocam a etapa;
 * avanço automático lento (site.json → process.autoAdvanceMs) que pausa ao
 * passar o mouse, focar, interagir ou sair da tela. Desligado com reduced motion.
 */
export default function Process({ id }) {
  const { t } = useI18n();
  const fx = useEffects();
  const steps = site.process?.steps || [];
  const ms = site.process?.autoAdvanceMs || 7000;
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false); // hover/foco
  const [stopped, setStopped] = useState(false); // o usuário escolheu uma etapa
  const [visible, setVisible] = useState(false);
  const root = useRef(null);
  const tabs = useRef([]);
  const auto = !fx.reducedMotion && !stopped;
  const running = auto && !hold && visible;

  useEffect(() => {
    const el = root.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return undefined;
    const tm = setTimeout(() => setActive((a) => (a + 1) % steps.length), ms);
    return () => clearTimeout(tm);
  }, [running, active, ms, steps.length]);

  if (!steps.length) return null;

  const pick = (i, focus) => {
    setActive(i);
    setStopped(true);
    if (focus) tabs.current[i]?.focus();
  };
  const onKey = (e) => {
    const n = steps.length;
    const map = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (map[e.key]) { e.preventDefault(); pick((active + map[e.key] + n) % n, true); }
    if (e.key === 'Home') { e.preventDefault(); pick(0, true); }
    if (e.key === 'End') { e.preventDefault(); pick(n - 1, true); }
  };
  const s = steps[active];
  const k = `process.steps.${s}`;

  return (
    <Section id={id} title={t('process.title')} subtitle={t('process.subtitle')} className="process-section">
      <div
        ref={root}
        className={`process reveal ${running ? 'is-running' : ''}`}
        style={{ '--n': steps.length, '--a': active, '--ms': `${ms}ms` }}
        onPointerEnter={() => setHold(true)}
        onPointerLeave={() => setHold(false)}
        onFocus={() => setHold(true)}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHold(false); }}
      >
        <div className="process__rail" aria-hidden="true"><span className="process__fill" /></div>
        <div className="process__tabs" role="tablist" aria-label={t('process.title')} onKeyDown={onKey}>
          {steps.map((st, i) => (
            <button
              key={st}
              ref={(el) => { tabs.current[i] = el; }}
              type="button"
              role="tab"
              id={`step-${st}`}
              aria-selected={i === active}
              aria-controls={`step-panel`}
              tabIndex={i === active ? 0 : -1}
              className={`process__tab ${i < active ? 'is-done' : ''} ${i === active ? 'is-active' : ''}`}
              onClick={() => pick(i)}
            >
              <span className="process__dot mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="process__tt">
                <strong>{t(`process.steps.${st}.title`)}</strong>
                <span className="muted small">{t(`process.steps.${st}.short`)}</span>
              </span>
              {i === active && auto && <span key={`${active}-${running}`} className="process__timer" aria-hidden="true" />}
            </button>
          ))}
        </div>

        <div id="step-panel" role="tabpanel" aria-labelledby={`step-${s}`} className="process__panel card" tabIndex={0}>
          <div key={s} className="process__content">
            <div className="process__head">
              <span className="process__icon"><Icon name={ICONS[active % ICONS.length]} size={26} /></span>
              <p className="mono small muted">{t('process.labels.step')} {active + 1}/{steps.length}</p>
              <h3>{t(`${k}.title`)}</h3>
            </div>
            <dl className="process__cols">
              {['happens', 'receive', 'do'].map((c, i) => (
                <div key={c} className="process__col" style={{ '--i': i }}>
                  <dt className="mono">{t(`process.labels.${c}`)}</dt>
                  <dd>{t(`${k}.${c}`)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </Section>
  );
}
