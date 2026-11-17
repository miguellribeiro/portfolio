import type { Project } from '../../packages/ui/types';
// Dados profissionais migrados de src/data; nenhum preço ou plano importado.
export const projects: Project[] = [
  {
    "id": "sinapse",
    "title": "Sinapse",
    "description": "Plataforma web interna para registro diário de atividades e compartilhamento de conhecimento corporativo.",
    "alt": "Capa ilustrativa do Sinapse: rede de nós de conhecimento conectados",
    "tags": [
      "React",
      "NestJS",
      "Oracle PL/SQL",
      "UX"
    ],
    "status": "Em produção · Uso corporativo"
  },
  {
    "id": "bankup",
    "title": "Bankup",
    "description": "Sistema gerenciado sob metodologia Scrum, focado em entregas de alto valor agregado e fluxo contínuo.",
    "alt": "Capa ilustrativa do Bankup: quadro de sprint com fluxo de entregas",
    "tags": [
      "Scrum",
      "Java",
      "Arquitetura",
      "Gestão"
    ],
    "status": "Concluído"
  }
];
export const experience = [
  {
    "period": "2023 — Atual",
    "role": "Líder Técnico & Desenvolvedor Full Stack",
    "org": "Hermanos TI",
    "description": "Responsável por liderar a equipe de desenvolvimento, arquitetar plataformas internas de gestão e implementar melhorias de infraestrutura, governança de dados e criptografia."
  },
  {
    "period": "Abr/2025 — Dez/2025",
    "role": "Scrum Master",
    "org": "Projeto Bankup",
    "description": "Facilitação de cerimônias ágeis e gestão do fluxo de entregas, garantindo alinhamento técnico, remoção de impedimentos e qualidade no ciclo de vida do software."
  }
];
export const stack = ["React","TypeScript","JavaScript","Java","Spring Boot","NestJS","Python","Oracle PL/SQL","Git","Docker","Google Tag Manager"];
export const about = "Sou desenvolvedor Full Stack e Líder Técnico, com sólida experiência em gerenciar o ciclo completo de desenvolvimento de software. Minha trajetória inclui desde a facilitação de equipes ágeis como Scrum Master até a arquitetura de plataformas corporativas e a elaboração de propostas executivas para governança e segurança de dados.";
export const github = "https://github.com/miguellribeiro";
export const linkedin = "https://www.linkedin.com/in/miguel-antonio-pereira-ribeiro";
