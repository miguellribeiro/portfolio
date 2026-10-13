import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/context.js';

export default function Lightbox({ images, alt, startIndex = 0, onClose }) {
  const { t } = useI18n();
  const [i, setI] = useState(startIndex);
  const closeRef = useRef(null);
  const prev = useCallback(() => setI((x) => (x - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setI((x) => (x + 1) % images.length), [images.length]);

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
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={onClose}>
      <div className="lightbox__inner" onClick={(e) => e.stopPropagation()}>
        <img src={images[i]} alt={`${alt} (${i + 1}/${images.length})`} />
        <div className="lightbox__controls">
          {images.length > 1 && <button type="button" className="btn" onClick={prev}>‹ {t('projects.prev')}</button>}
          <span className="muted">{i + 1} / {images.length}</span>
          {images.length > 1 && <button type="button" className="btn" onClick={next}>{t('projects.next')} ›</button>}
          <button type="button" className="btn" ref={closeRef} onClick={onClose}>{t('projects.close')} ✕</button>
        </div>
      </div>
    </div>
  );
}
