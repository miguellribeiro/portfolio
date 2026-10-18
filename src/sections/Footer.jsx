import { useI18n } from '../i18n/context.js';
import { getChannels } from '../engine/channels.js';
import { ChannelAnchor } from '../components/ChannelLink.jsx';
import BrandIcon from '../components/BrandIcon.jsx';
import Wordmark from '../components/Wordmark.jsx';
import { site } from '../engine/content.js';

export default function Footer({ id }) {
  const { t } = useI18n();
  return (
    <footer id={id} className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Wordmark name={site.brand?.name || 'Manpe'} size="sm" />
          <p className="muted small">© {new Date().getFullYear()} {t('footer.text')}</p>
        </div>
        <ul className="footer__channels">
          {getChannels(t).map((ch) => (
            <li key={ch.key}>
              <ChannelAnchor ch={ch} className="footer__icon" aria-label={`${t(`contact.${ch.key}`)}: ${ch.value}`}>
                <BrandIcon name={ch.key} size={18} />
              </ChannelAnchor>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
