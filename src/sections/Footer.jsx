import { useI18n } from '../i18n/context.js';
import { getChannels } from '../engine/channels.js';
import { ChannelAnchor } from '../components/ChannelLink.jsx';
import BrandIcon from '../components/BrandIcon.jsx';

export default function Footer({ id }) {
  const { t } = useI18n();
  return (
    <footer id={id} className="footer">
      <div className="container footer__inner">
        <p className="muted small">© {new Date().getFullYear()} {t('footer.text')}</p>
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
