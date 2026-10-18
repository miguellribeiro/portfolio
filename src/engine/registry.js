import Hero from '../sections/Hero.jsx';
import Bento from '../sections/Bento.jsx';
import About from '../sections/About.jsx';
import Marquee from '../sections/Marquee.jsx';
import Projects from '../sections/Projects.jsx';
import Experience from '../sections/Experience.jsx';
import Testimonials from '../sections/Testimonials.jsx';
import Process from '../sections/Process.jsx';
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
  bento: Bento,
  stats: Bento, // aliases da v1: números + diferenciais agora vivem no bento
  counters: Bento,
  capabilities: Bento,
  skills: Bento,
  about: About,
  marquee: Marquee,
  projects: Projects,
  experience: Experience,
  timeline: Experience,
  testimonials: Testimonials,
  process: Process,
  steps: Process,
  plans: Plans,
  pricing: Plans,
  contact: Contact,
  footer: Footer,
};

export { UNNUMBERED } from './sectionMeta.js';
