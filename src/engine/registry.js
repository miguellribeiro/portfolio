import Hero from '../sections/Hero.jsx';
import Stats from '../sections/Stats.jsx';
import About from '../sections/About.jsx';
import Capabilities from '../sections/Capabilities.jsx';
import Marquee from '../sections/Marquee.jsx';
import Projects from '../sections/Projects.jsx';
import Experience from '../sections/Experience.jsx';
import Testimonials from '../sections/Testimonials.jsx';
import Plans from '../sections/Plans.jsx';
import Contact from '../sections/Contact.jsx';
import Footer from '../sections/Footer.jsx';

/**
 * Registry: `type` (em site.json → sections) → componente.
 * Para criar uma nova seção: crie o componente em src/sections/,
 * registre aqui e adicione { id, type, enabled } em site.json.
 */
export const registry = {
  hero: Hero,
  stats: Stats,
  counters: Stats,
  about: About,
  capabilities: Capabilities,
  skills: Capabilities,
  marquee: Marquee,
  projects: Projects,
  experience: Experience,
  timeline: Experience,
  testimonials: Testimonials,
  plans: Plans,
  pricing: Plans,
  contact: Contact,
  footer: Footer,
};

export { UNNUMBERED } from './sectionMeta.js';
