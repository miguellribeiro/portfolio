import { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, useScroll, useTransform } from 'motion/react';
import * as M from 'motion/react-m';
import { useI18n } from '../i18n/context.js';
import { projects } from '../engine/content.js';
import { useEffects } from '../engine/effects.js';
import { getChannels, whatsappHref } from '../engine/channels.js';
import Section from '../components/Section.jsx';
import Lightbox from '../components/Lightbox.jsx';
import SmartImage from '../components/SmartImage.jsx';
import { ChannelAnchor } from '../components/ChannelLink.jsx';
import { useMediaQuery } from '../hooks/useMediaQuery.js';
import { useMagnetic } from '../hooks/useMagnetic.js';
import ProjectDeck from '../components/ProjectDeck.jsx';
import { MOBILE_DECK } from '../engine/breakpoints.js';

const asset = (id, file) => `${import.meta.env.BASE_URL}projects/${id}/${file}`;

function ProjectCard({ p, i }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const text = t(`projects.items.${p.id}`);
  const gallery = (p.gallery || []).map((f) => asset(p.id, f));
  const images = [asset(p.id, p.cover), ...gallery];
  const num = String(i + 1).padStart(2, '0');
  const tagMap = t('projects.tags');
  const tag = (x) => (tagMap && typeof tagMap === 'object' && tagMap[x]) || x;
  const cover = (
    <>
      <SmartImage src={asset(p.id, p.cover)} alt={text.alt} width={1200} height={750} />
      <span className="pcard__shade" aria-hidden="true" />
      <span className="pcard__num" aria-hidden="true">{num}</span>
      {gallery.length > 0 && <span className="pcard__zoom mono" aria-hidden="true">+ {images.length}</span>}
    </>
  );
  return (
    <li className="pcard" style={{ '--i': i }}>
      <article className="pcard__inner" aria-labelledby={`p-${p.id}`} tabIndex={gallery.length ? undefined : 0}>
        {gallery.length > 0 ? (
          <button type="button" className="pcard__cover" onClick={() => setOpen(true)} aria-label={`${t('projects.gallery')}: ${text.title}`}>{cover}</button>
        ) : (
          <div className="pcard__cover">{cover}</div>
        )}
        <div className="pcard__body">
          <div className="pcard__meta">
            <span className={`status status--${p.status}`}>{t(`projects.status.${p.status}`)}</span>
            {p.confidential && (
              <span className="badge badge--lock mono">
                <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
                {t('projects.confidential')}
              </span>
            )}
          </div>
          <h3 id={`p-${p.id}`}>{text.title}</h3>
          <p className="muted">{text.description}</p>
          <ul className="tags pcard__tags" aria-label="tags">
            {p.tags.map((x, j) => <li key={x} className="tag mono" style={{ '--t': j }}>{tag(x)}</li>)}
          </ul>
          {(p.links?.demo || p.links?.repo) && (
            <div className="project__links">
              {p.links?.demo && <a className="btn btn--sm" href={p.links.demo} target="_blank" rel="noopener noreferrer">{t('projects.demo')} ↗</a>}
              {p.links?.repo && <a className="btn btn--sm" href={p.links.repo} target="_blank" rel="noopener noreferrer">{t('projects.repo')} ↗</a>}
            </div>
          )}
        </div>
      </article>
      <AnimatePresence>
        {open && <Lightbox images={images} alt={text.alt} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </li>
  );
}

function EndCard() {
  const { t } = useI18n();
  const magnetic = useMagnetic();
  const wa = getChannels(t).find((c) => c.key === 'whatsapp');
  const ch = wa && { ...wa, href: whatsappHref(t('projects.end.message')) };
  return (
    <li className="pcard pcard--end">
      <div className="pcard__inner">
        <span className="pcard__plus" aria-hidden="true">+</span>
        <h3>{t('projects.end.title')}</h3>
        <p className="muted">{t('projects.end.text')}</p>
        {ch ? (
          <ChannelAnchor ch={ch} className="btn btn--primary" {...magnetic}>{t('projects.end.cta')} <span className="btn__arrow" aria-hidden="true">→</span></ChannelAnchor>
        ) : (
          <a className="btn btn--primary" href="#contact">{t('projects.end.cta')}</a>
        )}
      </div>
    </li>
  );
}

/**
 * Projetos em trilho horizontal.
 * Desktop (≥1024px, com movimento): seção "sticky" — a rolagem vertical move o trilho (useScroll/useTransform);
 * a altura da seção = distância horizontal + 1 viewport. 681–1023px / reduced motion: swipe nativo com scroll-snap.
 * Mobile (≤ 680px): deck de cards empilhados + painel inferior (components/ProjectDeck.jsx).
 */
export default function Projects({ id }) {
  const { t } = useI18n();
  const fx = useEffects();
  const wide = useMediaQuery('(min-width: 1024px)');
  const mobile = useMediaQuery(MOBILE_DECK);
  const pinned = wide && !fx.reducedMotion;
  const outer = useRef(null);
  const track = useRef(null);
  const [dist, setDist] = useState(0);

  useLayoutEffect(() => {
    const el = track.current;
    // mobile: o deck substitui o trilho (as duas media queries podem mudar em eventos separados)
    if (!pinned || mobile || !el) { setDist(0); return undefined; }
    const measure = () => setDist(Math.max(0, el.scrollWidth - el.parentElement.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, [pinned, mobile]);

  const { scrollYProgress } = useScroll({ target: outer, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, (v) => -v * dist);
  const bar = useTransform(scrollYProgress, [0, 1], [0.08, 1]);

  if (mobile) {
    return (
      <Section id={id} title={t('projects.title')} subtitle={t('projects.subtitle')} className="projects-section is-deck" sectionRef={outer}>
        <ProjectDeck projects={projects} />
      </Section>
    );
  }

  return (
    <Section
      id={id}
      title={t('projects.title')}
      subtitle={t('projects.subtitle')}
      className={`projects-section ${pinned ? 'is-pinned' : 'is-swipe'}`}
      sectionRef={outer}
      style={pinned && dist ? { height: `calc(${dist}px + 100vh)` } : undefined}
    >
      <div className="hproj__viewport">
        <M.ul ref={track} className="hproj__track" style={pinned ? { x } : undefined} aria-label={t('projects.title')}>
          {projects.map((p, i) => <ProjectCard key={p.id} p={p} i={i} />)}
          <EndCard />
        </M.ul>
      </div>
      <div className="hproj__foot" aria-hidden="true">
        <span className="mono small">{t('projects.hint')}</span>
        {pinned && <span className="hproj__bar"><M.span style={{ scaleX: bar }} /></span>}
      </div>
    </Section>
  );
}
