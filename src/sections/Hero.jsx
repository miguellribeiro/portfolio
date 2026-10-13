import { useI18n } from '../i18n/context.js';

export default function Hero({ id }) {
  const { t } = useI18n();
  return (
    <section id={id} className="hero" aria-labelledby={`${id}-title`}>
      <div className="container">
        <p className="eyebrow">{t('hero.eyebrow')}</p>
        <h1 id={`${id}-title`}>{t('hero.title')}</h1>
        <p className="hero__subtitle">{t('hero.subtitle')}</p>
        <div className="hero__ctas">
          <a className="btn btn--primary" href="#projects">{t('hero.ctaPrimary')}</a>
          <a className="btn" href="#contact">{t('hero.ctaSecondary')}</a>
        </div>
      </div>
    </section>
  );
}
