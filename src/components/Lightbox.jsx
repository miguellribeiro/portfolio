import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import * as M from 'motion/react-m';
import { useI18n } from '../i18n/context.js';

const slide = {
  enter: (d) => ({ opacity: 0, x: d * 40 }),
  center: { opacity: 1, x: 0 },
  exit: (d) => ({ opacity: 0, x: d * -40 }),
};

export default function Lightbox({ images, alt, startIndex = 0, onClose }) {
  const { t } = useI18n();
  const [[i, dir], setState] = useState([startIndex, 0]);
  const closeRef = useRef(null);
  const go = useCallback((d) => setState(([x]) => [(x + d + images.length) % images.length, d]), [images.length]);
  const prev = useCallback(() => go(-1), [go]);
  const next = useCallback(() => go(1), [go]);

  useEffect(() => {
    const last = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      last?.focus?.();
    };
  }, [onClose, prev, next]);

  return (
    <M.div
      className="lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={onClose}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
    >
      <M.div
        className="lightbox__inner" onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
      >
        <div className="lightbox__stage">
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <M.img
              key={i} src={images[i]} alt={`${alt} (${i + 1}/${images.length})`} custom={dir}
              variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}
            />
          </AnimatePresence>
        </div>
        {images.length > 1 && (
          <div className="lightbox__thumbs">
            {images.map((src, k) => (
              <button
                key={src} type="button" className="lightbox__thumb" aria-current={k === i || undefined}
                aria-label={`${k + 1} / ${images.length}`} onClick={() => setState([k, k > i ? 1 : -1])}
              >
                <img src={src} alt="" width="96" height="60" />
              </button>
            ))}
          </div>
        )}
        <div className="lightbox__controls">
          {images.length > 1 && <button type="button" className="btn btn--sm" onClick={prev}>← {t('projects.prev')}</button>}
          <span className="mono">{i + 1} / {images.length}</span>
          {images.length > 1 && <button type="button" className="btn btn--sm" onClick={next}>{t('projects.next')} →</button>}
          <button type="button" className="btn btn--sm" ref={closeRef} onClick={onClose}>{t('projects.close')} ✕</button>
        </div>
      </M.div>
    </M.div>
  );
}
