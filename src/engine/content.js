import siteJson from '../data/site.json';
import projectsJson from '../data/projects.json';
import ptBR from '../data/locales/pt-BR.json';
import es from '../data/locales/es.json';
import en from '../data/locales/en.json';
import { validateContent } from './validate.js';

/** @type {import('./types.js').SiteConfig} */
export const site = siteJson;
/** @type {import('./types.js').ProjectDef[]} */
export const projects = projectsJson.projects;

/** Para adicionar um idioma: importe o JSON aqui e registre em site.json → locales. */
export const messages = { 'pt-BR': ptBR, es, en };

if (import.meta.env.DEV) validateContent({ site, projects, messages });
