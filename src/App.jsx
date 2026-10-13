import { I18nProvider } from './i18n/I18nProvider.jsx';
import Header from './components/Header.jsx';
import PageRenderer from './engine/PageRenderer.jsx';
import { EffectsProvider } from './engine/EffectsProvider.jsx';
import { useTheme } from './engine/useTheme.js';
import { site } from './engine/content.js';

export default function App() {
  const [mode, toggleMode] = useTheme(site.theme);
  return (
    <I18nProvider>
      <EffectsProvider>
        <a className="skip-link" href="#main">Skip / Pular</a>
        <Header mode={mode} onToggleTheme={toggleMode} />
        <PageRenderer />
      </EffectsProvider>
    </I18nProvider>
  );
}
