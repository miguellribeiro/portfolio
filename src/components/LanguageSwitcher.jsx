import { useI18n } from '../i18n/context.js';
import Segmented from './Segmented.jsx';

export default function LanguageSwitcher() {
  const { locale, setLocale, locales, t } = useI18n();
  return (
    <Segmented
      id="lang"
      size="sm"
      label={t('lang')}
      value={locale}
      onChange={setLocale}
      options={locales.map((l) => ({ value: l.code, label: l.label, lang: l.code, title: l.name }))}
    />
  );
}
