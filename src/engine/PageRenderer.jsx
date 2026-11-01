import { Fragment } from 'react';
import { registry } from './registry.js';
import { site } from './content.js';
import { CurveText } from '../components/Decor.jsx';

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
          if (!Cmp) return null;
          // "curveText": a stack em curva vira o divisor (onda superior) desta seção
          return s.curveText
            ? <Fragment key={s.id}><CurveText /><Cmp id={s.id} /></Fragment>
            : <Cmp key={s.id} id={s.id} />;
        })}
      </main>
      {FooterCmp && <FooterCmp id={footer.id} />}
    </>
  );
}
