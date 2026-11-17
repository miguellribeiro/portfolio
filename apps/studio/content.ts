import type { Plan } from '../../packages/ui/types';
// Migração do conteúdo comercial existente em src/data (pt-BR, BRL).
export const plans: Plan[] = [
  {
    "id": "essencial",
    "name": "Essencial",
    "audience": "Para marcar presença online com uma página simples e profissional.",
    "features": [
      "Página única",
      "Seções básicas",
      "Manutenção sob demanda",
      "Hospedagem e domínio inclusos (subdomínio Manpe, ex.: seunegocio.manpestudio.com.br)",
      "Resposta em até 48 h"
    ],
    "monthlyBRL": 149
  },
  {
    "id": "profissional",
    "name": "Profissional",
    "audience": "Para negócios que querem apresentar serviços e receber pedidos pelo WhatsApp.",
    "features": [
      "Seções básicas",
      "Manutenção sob demanda",
      "Até 5 páginas com navegação",
      "Carrinho e pedidos via contato (WhatsApp)",
      "Uso do seu domínio próprio",
      "Resposta em até 24 h"
    ],
    "monthlyBRL": 297
  },
  {
    "id": "premium",
    "name": "Premium",
    "audience": "Para marcas que precisam de mais páginas, recursos sob medida e prioridade.",
    "features": [
      "Seções básicas",
      "Manutenção sob demanda",
      "Carrinho e pedidos via contato (WhatsApp)",
      "Registro e gestão de domínio inclusos — cuidamos da burocracia técnica, renovação anual e DNS (domínio registrado no seu nome)",
      "Múltiplas páginas (sujeito a análise de escopo)",
      "Prioridade maior em alterações",
      "Recursos personalizados",
      "Integração de API externa para carrinho",
      "Resposta em até 12 h"
    ],
    "monthlyBRL": 549
  },
  {
    "id": "premiumPainel",
    "name": "Premium + Painel",
    "audience": "Para gerenciar produtos e galeria e acompanhar resultados com autonomia.",
    "features": [
      "Seções básicas",
      "Manutenção sob demanda",
      "Carrinho e pedidos via contato (WhatsApp)",
      "Registro e gestão de domínio inclusos — cuidamos da burocracia técnica, renovação anual e DNS (domínio registrado no seu nome)",
      "Múltiplas páginas (sujeito a análise de escopo)",
      "Prioridade maior em alterações",
      "Recursos personalizados",
      "Integração de API externa para carrinho",
      "Resposta em até 12 h",
      "Painel de gestão com login seguro",
      "Cadastro de produtos e galeria",
      "Estatísticas de acesso e carrinho"
    ],
    "monthlyBRL": 897
  }
];
export const faq = [
  {
    "q": "Como funciona o pagamento?",
    "a": "Os planos são mensais e pré-pagos: a mensalidade é cobrada no início de cada ciclo, via Pix, boleto ou cartão. Não há taxa de adesão."
  },
  {
    "q": "Como funciona o cancelamento?",
    "a": "O cancelamento exige apenas um aviso prévio de 30 dias, sem multa. Todo o banco de dados e as informações do seu negócio são exportados e entregues a você, pois os dados são seus, embora o código da plataforma seja licenciado. O domínio é de propriedade do cliente. Caso o cancelamento ocorra antes de 12 meses de assinatura, será cobrada uma taxa de transferência e custos de registro no valor de R$ 150,00 para a liberação administrativa e técnica do domínio para outra hospedagem."
  },
  {
    "q": "O domínio fica no meu nome?",
    "a": "Sim. O domínio é registrado no seu nome (CPF ou CNPJ, no Brasil), com a Manpe como contato técnico — cuidamos da renovação anual e da configuração de DNS para você. O domínio é de propriedade do cliente. Caso o cancelamento ocorra antes de 12 meses de assinatura, será cobrada uma taxa de transferência e custos de registro no valor de R$ 150,00 para a liberação administrativa e técnica do domínio para outra hospedagem."
  },
  {
    "q": "Vocês emitem nota fiscal?",
    "a": "Atualmente atuo como profissional autônomo. O serviço é faturado mediante recibo de prestação de serviço (Pessoa Física) e formalizado por contrato com validade jurídica."
  },
  {
    "q": "Como é tratada a segurança dos dados (LGPD)?",
    "a": "A segurança é um pilar. Implementamos ofuscação, criptografia e boas práticas de arquitetura para garantir que os dados trafeguem e sejam armazenados em conformidade com as diretrizes de proteção de dados."
  },
  {
    "q": "E se eu precisar de algo fora do plano?",
    "a": "Mudanças e funcionalidades extras passam por uma análise de escopo (Discovery). Quando necessário, o ajuste entra como um aditivo na mensalidade — sempre combinado com você antes."
  },
  {
    "q": "A manutenção está inclusa?",
    "a": "Sim. A manutenção sob demanda está inclusa em todos os planos; o que muda é a prioridade nas alterações e o tempo de resposta, de até 48 h a até 12 h, conforme o plano."
  },
  {
    "q": "De quem são o código e os dados?",
    "a": "O código da plataforma é licenciado para uso enquanto o plano estiver ativo. Os dados do seu negócio e o domínio são seus — em um cancelamento, exportamos e entregamos todas as informações."
  }
];
export const disclaimer = "Funcionalidades extras, integrações complexas ou ferramentas de terceiros passarão por análise de escopo (Discovery) e poderão compor um aditivo no valor da mensalidade. Ferramentas pagas solicitadas pelo cliente podem ser contratadas e geridas diretamente por ele ou geridas pela Manpe, com acréscimo correspondente na mensalidade.";
export const email = "miguelanperibeiro@gmail.com";
export const whatsapp = "5512991827172";
export const services = [
  {
    "title": "Front-end & UX",
    "description": "Criação de interfaces dinâmicas e responsivas com foco em usabilidade e performance."
  },
  {
    "title": "Back-end & Arquitetura",
    "description": "Desenvolvimento de APIs robustas, arquitetura de banco de dados e lógica de negócios escalável."
  }
];

// Trabalho próprio verificável no repositório; não representa um case de cliente.
export const brandWork = [{
  id: 'ecossistema-manpe',
  title: 'Manpe Studio: um espaço para cada conversa.',
  status: 'Projeto próprio · Em homologação',
  description: 'Reestruturação do site da Manpe em duas experiências: serviços e planos no Studio; projetos, stack e trajetória no portfólio profissional.',
  deliverables: ['Aplicações React e TypeScript com builds independentes', 'Conteúdo comercial e profissional separado', 'Temas claro e escuro, navegação por teclado e layout responsivo'],
}];
export const products = [{
  id: 'manpe-web',
  title: 'Ecossistema web Manpe',
  status: 'Produto próprio · Em homologação',
  description: 'Um espaço para conhecer os serviços da Manpe e outro para explorar a experiência profissional de Miguel. Navegação acessível, versões clara e escura e uma interface que se adapta ao celular e ao computador.',
  availability: 'Em validação interna, sem data de lançamento definida.',
}];
