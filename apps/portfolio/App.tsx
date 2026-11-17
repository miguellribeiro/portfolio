import { Arrow, Section, Shell } from '../../packages/ui/Shell';
import { about, experience, github, linkedin, projects, stack } from './content';

export default function App() {
  return <Shell brand="Miguel Ribeiro" navigation={[{ label: 'Projetos', href: '#projetos' }, { label: 'Stack', href: '#stack' }, { label: 'Trajetória', href: '#trajetoria' }]} counterpart={{ label: 'Conheça a Manpe Studio', href: 'https://manpestudio.com.br/' }}>
    <section className="hero wrap" aria-labelledby="hero-title"><h1 id="hero-title">Miguel Ribeiro.<br /><em>Engenharia com visão de conjunto.</em></h1><p>Líder Técnico & Desenvolvedor Full Stack. Da arquitetura de sistemas à experiência de quem usa.</p><div className="actions"><a className="button" href="#projetos">Explorar projetos<Arrow /></a><a href={github}>GitHub</a><a href={linkedin}>LinkedIn</a></div></section>
    <Section id="sobre" title="Construir é conectar as partes."><p>{about}</p></Section>
    <Section id="projetos" title="Projetos selecionados."><p className="section-intro">Experiência técnica e colaboração. Detalhes sensíveis de projetos corporativos são preservados.</p>{projects.map(project => <article key={project.id} className="project"><div><h3>{project.title}</h3><p className="muted">{project.status}</p></div><div><p>{project.description}</p><p className="tags">{project.tags.join(' · ')}</p></div></article>)}</Section>
    <Section id="conquistas" title="Contribuições que marcam a trajetória."><div className="rows"><article><h3>Plataformas corporativas</h3><p>Arquitetura de plataformas internas, governança de dados e criptografia na Hermanos TI.</p></article><article><h3>Facilitação ágil</h3><p>Atuação como Scrum Master no projeto Bankup, com organização do fluxo e acompanhamento das entregas.</p></article></div></Section>
    <Section id="stack" title="Ferramentas para cada camada."><ul className="stack">{stack.map(item => <li key={item}>{item}</li>)}</ul></Section>
    <Section id="trajetoria" title="Trajetória profissional."><div className="timeline">{experience.map(item => <article key={`${item.org}-${item.role}`}><p className="muted">{item.period}</p><div><h3>{item.role}</h3><p>{item.org}</p><p className="muted">{item.description}</p></div></article>)}</div></Section>
  </Shell>;
}
