import { useI18n } from '../i18n/context.js';

export default function Footer({ id }) {
  const { t } = useI18n();
  return (
    <footer id={id} className="footer">
      <div className="container">
        <p className="muted small">© {new Date().getFullYear()} {t('footer.text')}</p>
      </div>
    </footer>
  );
}
