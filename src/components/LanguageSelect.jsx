import { useI18n } from '../i18n/context.js';
import ListSelect from './ListSelect.jsx';

/** Seletor de idioma (bandeira SVG + código). A escolha fica salva em localStorage. */
export default function LanguageSelect() {
  const { locale, setLocale, locales, t } = useI18n();
  return (
    <ListSelect
      label={t('lang')}
      value={locale}
      onChange={setLocale}
      options={locales.map((l) => ({ ...l, lang: l.code }))}
    />
  );
}
