import * as M from 'motion/react-m';

/**
 * Toggle segmentado com pílula deslizante (layoutId do motion).
 * options: [{ value, label, lang?, title? }]
 */
export default function Segmented({ id, label, options, value, onChange, className = '', size }) {
  return (
    <div className={`seg ${size ? `seg--${size}` : ''} ${className}`} role="group" aria-label={label}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            className="seg__btn"
            aria-pressed={active}
            lang={o.lang}
            title={o.title}
            onClick={() => onChange(o.value)}
          >
            {active && (
              <M.span layoutId={`seg-${id}`} className="seg__pill" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />
            )}
            <span className="seg__label">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
