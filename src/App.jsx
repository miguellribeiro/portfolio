import { I18nProvider } from './i18n/I18nProvider.jsx';
import Header from './components/Header.jsx';
import Loader from './components/Loader.jsx';
import { ChannelProvider } from './components/ChannelOverlay.jsx';
import PageRenderer from './engine/PageRenderer.jsx';
import { EffectsProvider } from './engine/EffectsProvider.jsx';
import { useTheme } from './engine/useTheme.js';
import { site } from './engine/content.js';

export default function App() {
  const [mode, toggleMode] = useTheme(site.theme);
  return (
    <I18nProvider>
      <EffectsProvider>
        <ChannelProvider>
          <a className="skip-link" href="#main">Skip / Pular</a>
          <Header mode={mode} onToggleTheme={toggleMode} />
          <PageRenderer />
          <Loader name={site.brand?.name} />
        </ChannelProvider>
      </EffectsProvider>
    </I18nProvider>
  );
}
