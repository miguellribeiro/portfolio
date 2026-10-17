/** Check em SVG com traço "desenhável" (pathLength=1). */
export default function Check({ className = '' }) {
  return (
    <svg className={`check ${className}`} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path pathLength="1" d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
