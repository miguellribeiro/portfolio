export default function Section({ id, title, subtitle, children, className = '' }) {
  return (
    <section id={id} className={`section ${className}`} aria-labelledby={`${id}-title`}>
      <div className="container">
        <header className="section__head">
          <h2 id={`${id}-title`}>{title}</h2>
          {subtitle && <p className="muted">{subtitle}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
