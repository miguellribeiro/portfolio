/** Mockup genérico de um ERP (HTML/CSS/SVG, sem dados reais). Decorativo. */
const BARS = [38, 52, 44, 66, 58, 74, 62, 86, 70, 92, 80, 98];

export default function DashboardMockup({ text }) {
  return (
    <div className="mock" aria-hidden="true">
      <div className="mock__top">
        <span className="mock__dots"><i /><i /><i /></span>
        <span className="mock__app mono">{text.app}</span>
      </div>
      <div className="mock__body">
        <ul className="mock__nav">
          {text.nav.map((n, i) => <li key={n} className={i === 2 ? 'is-active' : ''}>{n}</li>)}
        </ul>
        <div className="mock__main">
          <div className="mock__kpis">
            {text.kpis.map((k, i) => (
              <div key={k} className="mock__kpi">
                <span>{k}</span>
                <b className="mono">{['00.0k', '000', '00,0'][i]}</b>
                <i style={{ '--w': `${60 + i * 12}%` }} />
              </div>
            ))}
          </div>
          <div className="mock__chart">
            <span className="mock__chart-title">{text.chart}</span>
            <svg viewBox="0 0 240 90" preserveAspectRatio="none">
              <defs>
                <linearGradient id="mockArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="var(--c-primary)" stopOpacity=".35" />
                  <stop offset="1" stopColor="var(--c-primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {BARS.map((h, i) => (
                <rect key={i} x={i * 20 + 4} y={90 - h * 0.8} width="10" height={h * 0.8} rx="2" className="mock__bar" />
              ))}
              <path d="M0 70 C30 60 50 66 80 48 S130 40 160 30 S210 18 240 10 L240 90 L0 90Z" fill="url(#mockArea)" />
              <path d="M0 70 C30 60 50 66 80 48 S130 40 160 30 S210 18 240 10" fill="none" stroke="var(--c-primary)" strokeWidth="2" />
            </svg>
          </div>
          <div className="mock__rows">
            {[0, 1, 2].map((r) => <div key={r} className="mock__row"><i /><i /><i /></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
