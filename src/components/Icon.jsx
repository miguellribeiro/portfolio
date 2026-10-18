/** Ícones de linha (viewBox 24, stroke = currentColor). */
const PATHS = {
  shield: <><path d="M12 3 4.5 6v5.6c0 4.6 3.1 8.2 7.5 9.4 4.4-1.2 7.5-4.8 7.5-9.4V6Z" /><path d="m8.8 12.2 2.3 2.3 4.3-4.6" /></>,
  layout: <><rect x="3" y="4" width="18" height="16" rx="2.5" /><path d="M3 9h18M9 9v11" /></>,
  server: <><rect x="3.5" y="4" width="17" height="6.5" rx="2" /><rect x="3.5" y="13.5" width="17" height="6.5" rx="2" /><path d="M7.5 7.25h.01M7.5 16.75h.01M11 7.25h5M11 16.75h5" /></>,
  lock: <><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7M12 14.5v2" /></>,
  spark: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></>,
  pulse: <><path d="M3 12h4l2.5-6 5 12 2.5-6h4" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  chat: <><path d="M5 18.5 3.5 21l4-1.3A9 9 0 1 0 5 18.5Z" /></>,
  pen: <><path d="M4 20h4L19 9l-4-4L4 16Z" /><path d="m13.5 6.5 4 4" /></>,
  code: <><path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.5 5l-3 14" /></>,
  rocket: <><path d="M12 15.5 8.5 12C10 7 13.5 4 19.5 4.5 20 10.5 17 14 12 15.5Z" /><path d="M8.5 12 5 12.5l-1.5 3 4-.5M12 15.5l-.5 3.5-3 1.5.5-4" /><circle cx="15" cy="9" r="1.3" /></>,
};

export default function Icon({ name, size = 22, className = '' }) {
  return (
    <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {PATHS[name] || PATHS.spark}
    </svg>
  );
}
