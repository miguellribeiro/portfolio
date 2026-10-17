import { useI18n } from '../i18n/context.js';
import { site } from '../engine/content.js';
import { getChannels } from '../engine/channels.js';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { ChannelAnchor } from './ChannelLink.jsx';
import BrandIcon from './BrandIcon.jsx';

const NAV = ['about', 'projects', 'plans', 'contact'];

export default function Header({ mode, onToggleTheme }) {
  const { t } = useI18n();
  const enabled = new Set(site.sections.filter((s) => s.enabled).map((s) => s.type));
  const wa = getChannels(t).find((c) => c.key === 'whatsapp');
  return (
    <header className="header">
      <div className="container header__inner">
        <a href="#main" className="brand">
          <span className="brand__mark mono" aria-hidden="true">{site.brand?.monogram || 'MR'}</span>
          <span className="brand__name">{t('hero.title')}</span>
        </a>
        <nav aria-label={t('nav')} className="nav">
          {NAV.filter((n) => enabled.has(n)).map((n) => (
            <a key={n} href={`#${n}`}>{t(`${n}.title`)}</a>
          ))}
        </nav>
        <div className="header__actions">
          <LanguageSwitcher />
          <button type="button" className="icon-btn" onClick={onToggleTheme} aria-label={t('theme')} title={t('theme')}>
            <span aria-hidden="true">{mode === 'dark' ? '☀' : '☾'}</span>
          </button>
          {wa && (
            <ChannelAnchor ch={wa} className="btn btn--sm btn--primary header__cta">
              <BrandIcon name="whatsapp" size={16} />
              <span className="header__cta-label">{t('headerCta')}</span>
            </ChannelAnchor>
          )}
        </div>
      </div>
    </header>
  );
}
