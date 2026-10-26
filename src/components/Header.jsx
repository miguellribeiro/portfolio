import { useI18n } from '../i18n/context.js';
import { site } from '../engine/content.js';
import { getChannels } from '../engine/channels.js';
import LanguageSelect from './LanguageSelect.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import Wordmark from './Wordmark.jsx';
import { ChannelAnchor } from './ChannelLink.jsx';
import BrandIcon from './BrandIcon.jsx';
import { useMagnetic } from '../hooks/useMagnetic.js';

const NAV = ['about', 'projects', 'plans', 'contact'];

export default function Header({ mode, onToggleTheme }) {
  const { t } = useI18n();
  const magnetic = useMagnetic();
  const enabled = new Set(site.sections.filter((s) => s.enabled).map((s) => s.type));
  const wa = getChannels(t).find((c) => c.key === 'whatsapp');
  const brand = site.brand?.name || 'Manpe';
  return (
    <header className="header">
      <div className="container header__inner">
        <a href="#main" className="brand" aria-label={brand}>
          <Wordmark name={brand} decorative />
        </a>
        <nav aria-label={t('nav')} className="nav">
          {NAV.filter((n) => enabled.has(n)).map((n) => (
            <a key={n} href={`#${n}`}>{t(`${n}.title`)}</a>
          ))}
        </nav>
        <div className="header__actions">
          <LanguageSelect />
          <ThemeToggle mode={mode} onToggle={onToggleTheme} label={t('theme')} />
          {wa && (
            <ChannelAnchor ch={wa} className="btn btn--sm btn--primary header__cta" aria-label={t('headerCtaAria')} {...magnetic}>
              <BrandIcon name="whatsapp" size={16} />
              <span className="header__cta-label">{t('headerCta')}</span>
            </ChannelAnchor>
          )}
        </div>
      </div>
    </header>
  );
}
