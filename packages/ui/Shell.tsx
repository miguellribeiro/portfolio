import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { NavigationItem } from './types';
import { Forest } from './manpe/Forest';
import { BrandIntro } from './manpe/BrandIntro';
import './tokens.css';
import '@fontsource/bricolage-grotesque/latin-600.css';
import '@fontsource/bricolage-grotesque/latin-700.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/instrument-serif/latin-400-italic.css';

type ShellProps = {
  brand: string;
  navigation: NavigationItem[];
  counterpart: { label: string; href: string };
  children: ReactNode;
};

export function Shell({ brand, navigation, counterpart, children }: ShellProps) {
  const [interactive, setInteractive] = useState(false);
  useEffect(() => setInteractive(true), []);
  const logo = useRef<HTMLImageElement>(null);
  const statusTarget = useRef<HTMLDivElement>(null);
  const contentTarget = useRef<HTMLElement>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  return <div className="site-shell" data-theme={theme}>
    <a className="skip-link" href="#main">Pular para o conteúdo</a>
    <header className="header wrap">
      <a className="brand" href="#main"><img ref={logo} src="/favicon.svg" width="36" height="36" alt="" /><span>{brand}</span></a>
      <nav aria-label="Navegação principal"><ul>{navigation.map(item => <li key={item.href}><a href={item.href}>{item.label}</a></li>)}</ul></nav>
      <button className="theme-toggle" type="button" disabled={!interactive} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={`Ativar tema ${theme === 'dark' ? 'claro' : 'escuro'}`}>{theme === 'dark' ? 'Tema claro' : 'Tema escuro'}</button>
      <BrandIntro logo={logo} statusTarget={statusTarget} contentTarget={contentTarget} theme={theme} />
    </header>
    <div className="resource-status" ref={statusTarget} />
    <main id="main" ref={contentTarget} tabIndex={-1}>{children}</main>
    <footer>
      <div className="footer wrap"><p>{brand}</p><a href={counterpart.href}>{counterpart.label}<Arrow /></a><a href="#main">Voltar ao início</a></div>
      <Forest theme={theme} />
    </footer>
  </div>;
}

export function Arrow() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>;
}

export function Section({ id, title, children, className = '' }: { id: string; title: string; children: ReactNode; className?: string }) {
  return <section className={`section wrap ${className}`} id={id} aria-labelledby={`${id}-title`}><h2 id={`${id}-title`}>{title}</h2>{children}</section>;
}
