import { useI18n } from '../i18n/context.js';
import { getChannels } from '../engine/channels.js';
import Section from '../components/Section.jsx';
import ChannelCard from '../components/ChannelLink.jsx';
import { GiantWord } from '../components/Decor.jsx';
import { useEffects } from '../engine/effects.js';

export default function Contact({ id }) {
  const { t } = useI18n();
  const { decor, footerScene } = useEffects();
  // Com a cena do footer ligada, a palavra gigante mora nela (atrás da grama); senão, fica no rodapé do Contato.
  const giantHere = decor && !footerScene;
  return (
    <Section id={id} title={t('contact.title')} subtitle={t('contact.subtitle')} className={`contact${giantHere ? ' contact--giant' : ''}`} after={giantHere ? <GiantWord /> : null}>
      <ul className="chan-grid">
        {getChannels(t).map((ch, i) => <ChannelCard key={ch.key} ch={ch} i={i} />)}
      </ul>
    </Section>
  );
}
