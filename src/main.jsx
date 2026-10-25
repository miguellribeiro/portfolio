import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Fontes auto-hospedadas (@fontsource, subset latin, font-display: swap).
// Se trocar theme.fonts em site.json, troque também estes imports.
import '@fontsource/bricolage-grotesque/latin-600.css';
import '@fontsource/bricolage-grotesque/latin-700.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import App from './App.jsx';
import { redirectLegacyLang, restoreLangScroll } from './i18n/I18nProvider.jsx';
import './styles.css';

// ?lang=xx (links antigos) → /xx/; senão monta o app no idioma do caminho.
if (!redirectLegacyLang()) {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  restoreLangScroll();
}
