import { Arrow, Section, Shell } from '../../packages/ui/Shell';
import { disclaimer, email, faq, plans, services, whatsapp } from './content';
import ContactForm from './ContactForm';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
export default function App() {
  return <Shell brand="manpe studio" navigation={[{ label: 'Serviços', href: '#servicos' }, { label: 'Trabalhos', href: '#trabalhos' }, { label: 'Planos', href: '#planos' }, { label: 'FAQ', href: '#faq' }]} counterpart={{ label: 'Conheça Miguel Ribeiro', href: 'https://miguel.manpestudio.com.br/' }}>
    <section className="hero wrap" aria-labelledby="hero-title">
      <h1 id="hero-title">Sua próxima ideia.<br />Um novo <em>começo digital.</em></h1>
      <p>Sites, landing pages e sistemas sob medida. Do primeiro desenho à evolução contínua do seu negócio.</p>
      <div className="actions"><a className="button" href="#planos">Encontrar meu plano<Arrow /></a><a href="#contato">Vamos conversar</a></div>
      <svg className="hero-line" viewBox="0 0 1200 58" fill="none" aria-hidden="true"><path d="M0 45C180 45 160 4 350 4S580 54 760 54 990 10 1200 20" stroke="currentColor" strokeWidth="1.5" /></svg>
    </section>
    <Section id="servicos" title="Da interface ao sistema que sustenta tudo."><div className="rows">{services.map(item => <article key={item.title}><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></Section>
    <Section id="trabalhos" title="O trabalho da marca, no seu próprio espaço."><p className="section-intro">A Manpe está reorganizando sua seleção de trabalhos comerciais. Os estudos de caso serão apresentados aqui com o contexto e a autorização de cada projeto.</p><a href="#contato">Converse sobre o seu projeto</a></Section>
    <Section id="produtos" title="Produtos em construção."><p className="section-intro">O catálogo de produtos da Manpe está em preparação. Para necessidades específicas ou integrações, vamos entender o seu cenário.</p><a href="#contato">Descrever uma necessidade</a></Section>
    <Section id="planos" title="Um plano para o seu momento."><p className="section-intro">Sites e landing pages. Mensalidades pré-pagas em reais, sem taxa de adesão e sem fidelidade.</p><div className="plans">{plans.map(plan => <article className="plan" key={plan.id}><h3>{plan.name}</h3><p>{plan.audience}</p><p className="price">{money.format(plan.monthlyBRL)}<span> / mês</span></p><ul>{plan.features.map(feature => <li key={feature}>{feature}</li>)}</ul><a className="button" href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Olá! Tenho interesse no plano ${plan.name} da Manpe (${money.format(plan.monthlyBRL)}/mês). Podemos conversar?`)}`}>Conversar sobre este plano<Arrow /></a></article>)}</div><p className="fine-print">{disclaimer}</p></Section>
    <Section id="faq" title="Antes de começar." className="faq">{faq.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</Section>
    <Section id="contato" title="Vamos dar forma à sua ideia."><a href={`mailto:${email}`}>{email}</a><ContactForm /></Section>
  </Shell>;
}
