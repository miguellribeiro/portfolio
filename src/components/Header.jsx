import { useI18n } from '../i18n/context.js';
import { site } from '../engine/content.js';
import LanguageSwitcher from './LanguageSwitcher.jsx';

const NAV = ['about', 'projects', 'plans', 'contact'];

export default function Header({ mode, onToggleTheme }) {
  const { t } = useI18n();
  const enabled = new Set(site.sections.filter((s) => s.enabled).map((s) => s.type));
  return (
    <header className="header">
      <div className="container header__inner">
        <a href="#main" className="brand">{t('hero.title')}</a>
        <nav aria-label={t('nav')} className="nav">
          {NAV.filter((n) => enabled.has(n)).map((n) => (
            <a key={n} href={`#${n}`}>{t(`${n}.title`)}</a>
          ))}
        </nav>
        <div className="header__actions">
          <LanguageSwitcher />
          <button type="button" className="icon-btn" onClick={onToggleTheme} aria-label={t('theme')} title={t('theme')}>
            {mode === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </div>
    </header>
  );
}
