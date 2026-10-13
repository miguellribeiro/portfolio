import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useI18n } from '../i18n/context.js';
import { projects } from '../engine/content.js';
import Section from '../components/Section.jsx';
import Lightbox from '../components/Lightbox.jsx';
import { useCardFx } from '../hooks/useCardFx.js';

const asset = (id, file) => `${import.meta.env.BASE_URL}projects/${id}/${file}`;

function ProjectCard({ p, i }) {
  const { t } = useI18n();
  const fx = useCardFx();
  const [open, setOpen] = useState(false);
  const text = t(`projects.items.${p.id}`);
  const images = [p.cover, ...(p.gallery || [])].map((f) => asset(p.id, f));
  return (
    <article
      className={`card project reveal ${fx.className}`}
      style={{ '--i': i }}
      onPointerMove={fx.onPointerMove}
      onPointerLeave={fx.onPointerLeave}
    >
      <button type="button" className="project__cover" onClick={() => setOpen(true)} aria-label={`${t('projects.gallery')}: ${text.title}`}>
        <img src={asset(p.id, p.cover)} alt={text.alt} loading="lazy" width="1200" height="750" />
        <span className="project__zoom mono" aria-hidden="true">+ {images.length}</span>
      </button>
      <div className="project__body">
        <div className="project__meta">
          <span className={`status status--${p.status}`}>{t(`projects.status.${p.status}`)}</span>
          {p.testDrive && (
            <span className="badge badge--soon" title={t('projects.testDrive')}>
              {t('projects.testDrive')}: {t('projects.soon')}
            </span>
          )}
        </div>
        <h3>{text.title}</h3>
        <p className="muted">{text.description}</p>
        <ul className="tags" aria-label="tags">
          {p.tags.map((tag) => <li key={tag} className="tag mono">{tag}</li>)}
        </ul>
        <div className="project__links">
          {p.links?.demo && <a className="btn btn--sm" href={p.links.demo} target="_blank" rel="noopener noreferrer">{t('projects.demo')} ↗</a>}
          {p.links?.repo && <a className="btn btn--sm" href={p.links.repo} target="_blank" rel="noopener noreferrer">{t('projects.repo')} ↗</a>}
        </div>
      </div>
      <AnimatePresence>
        {open && <Lightbox images={images} alt={text.alt} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </article>
  );
}

export default function Projects({ id }) {
  const { t } = useI18n();
  return (
    <Section id={id} title={t('projects.title')} subtitle={t('projects.subtitle')}>
      <div className="grid grid--2 projects">
        {projects.map((p, i) => <ProjectCard key={p.id} p={p} i={i} />)}
      </div>
    </Section>
  );
}
