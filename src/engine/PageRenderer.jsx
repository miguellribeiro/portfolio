import { registry } from './registry.js';
import { site } from './content.js';

/** Renderiza as seções na ordem definida em site.json. */
export default function PageRenderer() {
  const sections = site.sections.filter((s) => s.enabled);
  const body = sections.filter((s) => s.type !== 'footer');
  const footer = sections.find((s) => s.type === 'footer');
  const FooterCmp = footer && registry.footer;
  return (
    <>
      <main id="main">
        {body.map((s) => {
          const Cmp = registry[s.type];
          return Cmp ? <Cmp key={s.id} id={s.id} /> : null;
        })}
      </main>
      {FooterCmp && <FooterCmp id={footer.id} />}
    </>
  );
}
