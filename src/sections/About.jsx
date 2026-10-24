import { useI18n } from '../i18n/context.js';
import Section from '../components/Section.jsx';
import SolarSystem from '../components/SolarSystem.jsx';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { MOBILE_HERO_SOLAR } from '../engine/breakpoints.js';

export default function About({ id }) {
  const { t } = useI18n();
  // ≤ 680px o sistema solar vira fundo do hero (Hero.jsx) e sai daqui.
  const inHero = useMediaQuery(MOBILE_HERO_SOLAR);
  return (
    <Section
      id={id}
      title={t('about.title')}
      className={inHero ? 'about' : 'about about--solar'}
      after={inHero ? null : (
        <div className="about__mask" aria-hidden="true">
          <SolarSystem />
        </div>
      )}
    >
      <div className="prose">
        {t('about.paragraphs').map((p, i) => <p key={i} className="reveal" style={{ '--i': i }}>{p}</p>)}
      </div>
    </Section>
  );
}
