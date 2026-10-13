import { useI18n } from '../i18n/context.js';

export default function LanguageSwitcher() {
  const { locale, setLocale, locales, t } = useI18n();
  return (
    <div className="lang" role="group" aria-label={t('lang')}>
      {locales.map((l) => (
        <button
          key={l.code}
          type="button"
          lang={l.code}
          className="lang__btn"
          aria-pressed={locale === l.code}
          title={l.name}
          onClick={() => setLocale(l.code)}
        >
          {l.flag && <span aria-hidden="true">{l.flag} </span>}
          {l.label}
        </button>
      ))}
    </div>
  );
}
