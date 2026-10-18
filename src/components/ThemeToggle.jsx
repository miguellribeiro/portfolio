/** Botão de tema com morph sol ⇄ lua (só transform/opacity). */
export default function ThemeToggle({ mode, onToggle, label }) {
  return (
    <button type="button" className={`theme-btn theme-btn--${mode}`} onClick={onToggle} aria-label={label} title={label}>
      <svg className="theme-btn__svg" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <mask id="theme-moon-mask">
          <rect width="24" height="24" fill="#fff" />
          <circle className="theme-btn__cut" cx="17.5" cy="6.5" r="7" fill="#000" />
        </mask>
        <circle className="theme-btn__core" cx="12" cy="12" r="5" fill="currentColor" mask="url(#theme-moon-mask)" />
        <g className="theme-btn__rays" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 1.5v2.2M12 20.3v2.2M1.5 12h2.2M20.3 12h2.2M4.6 4.6l1.5 1.5M17.9 17.9l1.5 1.5M4.6 19.4l1.5-1.5M17.9 6.1l1.5-1.5" />
        </g>
      </svg>
    </button>
  );
}
