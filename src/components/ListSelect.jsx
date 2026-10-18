import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Flag from './Flag.jsx';

/**
 * Dropdown com listbox ARIA (setas, Home/End, Enter/Espaço, Esc, typeahead,
 * clique fora, devolve o foco). Usado pelo seletor de idioma e pelo de região.
 * options: [{ code, flag, name, label, lang? }]
 */
export default function ListSelect({ options: locales, value: locale, onChange: setLocale, label, buttonText, className = '' }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => Math.max(0, locales.findIndex((l) => l.code === locale)));
  const btn = useRef(null);
  const list = useRef(null);
  const wrap = useRef(null);
  const typed = useRef({ s: '', t: 0 });
  const uid = useId().replace(/:/g, '');
  const current = locales.find((l) => l.code === locale) || locales[0];

  const openList = useCallback((idx) => {
    setActive(idx ?? Math.max(0, locales.findIndex((l) => l.code === locale)));
    setOpen(true);
  }, [locales, locale]);

  const close = useCallback((focusBtn = true) => {
    setOpen(false);
    if (focusBtn) btn.current?.focus();
  }, []);

  const choose = (i) => {
    setLocale(locales[i].code);
    close();
  };

  useEffect(() => {
    if (!open) return undefined;
    list.current?.focus();
    const onDown = (e) => { if (!wrap.current?.contains(e.target)) close(false); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open, close]);

  const onButtonKey = (e) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
      const cur = Math.max(0, locales.findIndex((l) => l.code === locale));
      openList(e.key === 'ArrowUp' ? (cur - 1 + locales.length) % locales.length : cur);
    }
  };

  const onListKey = (e) => {
    const n = locales.length;
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setActive((a) => (a + 1) % n); break;
      case 'ArrowUp': e.preventDefault(); setActive((a) => (a - 1 + n) % n); break;
      case 'Home': e.preventDefault(); setActive(0); break;
      case 'End': e.preventDefault(); setActive(n - 1); break;
      case 'Enter': case ' ': e.preventDefault(); choose(active); break;
      case 'Escape': e.preventDefault(); close(); break;
      case 'Tab': close(false); break;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) { // typeahead
          const now = Date.now();
          typed.current.s = (now - typed.current.t > 700 ? '' : typed.current.s) + e.key.toLowerCase();
          typed.current.t = now;
          const i = locales.findIndex((l) => l.name.toLowerCase().startsWith(typed.current.s) || l.label.toLowerCase().startsWith(typed.current.s));
          if (i >= 0) setActive(i);
        }
    }
  };

  return (
    <div className={`lsel ${open ? 'is-open' : ''} ${className}`} ref={wrap}>
      <button
        ref={btn}
        type="button"
        className="lsel__btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`lsel-${uid}`}
        aria-label={`${label}: ${current.name}`}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onButtonKey}
      >
        <Flag code={current.flag || current.code} size={20} />
        <span className="lsel__code mono">{buttonText ? buttonText(current) : current.label}</span>
        <svg className="lsel__chev" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <ul
        ref={list}
        id={`lsel-${uid}`}
        className="lsel__list"
        role="listbox"
        tabIndex={-1}
        aria-label={label}
        aria-activedescendant={open ? `lsel-${uid}-${active}` : undefined}
        onKeyDown={onListKey}
        hidden={!open}
      >
        {locales.map((l, i) => (
          <li
            key={l.code}
            id={`lsel-${uid}-${i}`}
            role="option"
            lang={l.lang}
            aria-selected={l.code === locale}
            className={`lsel__opt ${i === active ? 'is-active' : ''}`}
            onPointerEnter={() => setActive(i)}
            onClick={() => choose(i)}
          >
            <Flag code={l.flag || l.code} size={22} />
            <span className="lsel__name">{l.name}</span>
            <span className="lsel__optcode mono">{l.label}</span>
            <svg className="lsel__check" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5 6.5 11.5 12.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </li>
        ))}
      </ul>
    </div>
  );
}
