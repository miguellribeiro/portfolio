import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChannelContext } from '../engine/channels.js';
import { useEffects } from '../engine/effects.js';
import { useI18n } from '../i18n/context.js';
import BrandIcon from './BrandIcon.jsx';

const DELAY = 700;

/**
 * Abre o destino de forma resistente a bloqueador de pop-up:
 * - mailto: troca location.href do próprio documento;
 * - externos: window.open dentro da janela de ativação do clique; se o navegador
 *   bloquear (retorna null), navega no próprio documento.
 */
export function openHref(href, external) {
  if (!external) { window.location.href = href; return; }
  const w = window.open(href, '_blank');
  if (w) w.opener = null;
  else window.location.href = href;
}

/** Provider + overlay de "Abrindo WhatsApp…" reaproveitado por contatos, header e planos. */
export function ChannelProvider({ children }) {
  const { t } = useI18n();
  const { reducedMotion } = useEffects();
  const [job, setJob] = useState(null);
  const timer = useRef(0);
  const lastFocus = useRef(null);
  const dialog = useRef(null);
  const cancelRef = useRef(null);

  const close = useCallback(() => {
    clearTimeout(timer.current);
    setJob(null);
    lastFocus.current?.focus?.();
  }, []);

  const launch = useCallback((target, e) => {
    if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0)) return false;
    if (reducedMotion) return false; // deixa o <a> abrir imediatamente
    e?.preventDefault();
    lastFocus.current = document.activeElement;
    setJob(target);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      openHref(target.href, target.external);
      setJob(null);
      lastFocus.current?.focus?.();
    }, DELAY);
    return true;
  }, [reducedMotion]);

  useEffect(() => {
    if (!job) return undefined;
    cancelRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') { // focus trap
        const f = dialog.current?.querySelectorAll('a[href], button');
        if (!f?.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [job, close]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const value = useMemo(() => ({ launch }), [launch]);
  const label = job ? t(`contact.${job.channel}`) : '';
  return (
    <ChannelContext.Provider value={value}>
      {children}
      {job && (
        <div className="chan-overlay" data-channel={job.channel} onClick={close}>
          <div
            ref={dialog}
            className="chan-overlay__card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chan-overlay-title"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="chan-overlay__icon"><BrandIcon name={job.channel} size={28} /></span>
            <p id="chan-overlay-title" className="chan-overlay__title" aria-live="polite">
              {t('contact.opening').replace('{channel}', label)}
            </p>
            <div className="chan-skel" aria-hidden="true">
              <span className="chan-skel__avatar skel" />
              <span className="chan-skel__lines">
                <i className="skel" /><i className="skel" /><i className="skel" />
              </span>
            </div>
            <span className="chan-overlay__bar" aria-hidden="true"><i /></span>
            <p className="sr-only">{t('contact.preparing')}</p>
            <div className="chan-overlay__actions">
              <button ref={cancelRef} type="button" className="btn btn--sm btn--ghost" onClick={close}>{t('contact.cancel')}</button>
              <a
                className="btn btn--sm btn--primary"
                href={job.href}
                {...(job.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={() => { clearTimeout(timer.current); setJob(null); }}
              >
                {t('contact.openNow')}
              </a>
            </div>
          </div>
        </div>
      )}
    </ChannelContext.Provider>
  );
}
