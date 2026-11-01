import { useI18n } from '../i18n/context.js';
import { getChannels } from '../engine/channels.js';
import Section from '../components/Section.jsx';
import ChannelCard from '../components/ChannelLink.jsx';
import { GiantWord } from '../components/Decor.jsx';

export default function Contact({ id }) {
  const { t } = useI18n();
  return (
    <Section id={id} title={t('contact.title')} subtitle={t('contact.subtitle')} className="contact" after={<GiantWord />}>
      <ul className="chan-grid">
        {getChannels(t).map((ch, i) => <ChannelCard key={ch.key} ch={ch} i={i} />)}
      </ul>
    </Section>
  );
}
