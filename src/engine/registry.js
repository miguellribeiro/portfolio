import Hero from '../sections/Hero.jsx';
import About from '../sections/About.jsx';
import Capabilities from '../sections/Capabilities.jsx';
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
  about: About,
  capabilities: Capabilities,
  skills: Capabilities,
  projects: Projects,
  experience: Experience,
  timeline: Experience,
  testimonials: Testimonials,
  plans: Plans,
  pricing: Plans,
  contact: Contact,
  footer: Footer,
};
