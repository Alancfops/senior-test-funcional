# Sênior Teste Funcional

Plataforma digital para **fisioterapeutas** acompanharem pacientes idosos com instrumentos funcionais padronizados (histórico, evolução e relatórios), conforme documentação em **`docs/`**.

---

## Organização deste repositório

| Pasta | Papel |
|-------|--------|
| **[backend/](backend/)** | API e regras de negócio (prioridade de desenvolvimento) |
| **[frontend/](frontend/)** | Aplicativo React Native (Expo): interface do cliente, alinhado aos requisitos e ao contrato da API |
| **[docs/](docs/)** | Especificação consolidada — produto (PRD e requisitos), engenharia, protocolos clínicos e políticas formais onde aplicável; contratos machine-readable em **`docs/contratos/`** |

**Monorepo com Bun workspaces** quando o código scaffold existir (um `package.json` na raiz listando `backend` e `frontend`). Detalhes de setup em **[docs/engenharia/arquitetura.md](docs/engenharia/arquitetura.md)** e fluxo **A→E** em **[docs/engenharia/repositorio-e-fluxo-desenvolvimento.md](docs/engenharia/repositorio-e-fluxo-desenvolvimento.md)**.

---

## Arquitetura do projeto (visão de sistema)

Este trecho resume **forma e responsabilidades** do software para onboarding técnico. **Não** descreve configurações operacionais em produção nem segredos e credenciais. **Governança de dados e conformidade regulatória** (LGPD no Brasil) são tratadas nos documentos de produto, em especial **`docs/produto/privacidade-e-lgpd.md`**.

### Camadas

| Camada | Função principal |
|--------|-------------------|
| **Cliente mobile** | Interface do profissional: cadastros orientados aos fluxos de produto, coleta estruturada por instrumento, visualização de resultados e acesso ao que o servidor já calculou/registrou. |
| **API (servidor)** | Portal único de regras: validação das operações permitidas ao usuário logado, cálculos e interpretações auxiliadas por parametrização, persistência de avaliações e emissão de artefatos (ex.: relatório em formato adequado ao produto). |
| **Persistência relacional** | Armazena contas profissionais, pacientes associados ao profissional e registro cronológico das avaliações, de modo que evoluções e relatórios sejam reconstruíveis de forma consistente. |

### Princípios arquiteturais

| Princípio | Na prática |
|-----------|-------------|
| **Servidor como fonte da verdade** | Pontuações, classificações parametrizadas, permissões (“cada perfil só acessa o que é dele”) e integridade dos registros ficam garantidas pela API — o app cliente não redefine regra de negócio sozinho. |
| **Fronteira clara cliente/servidor** | O cliente oferece a experiência do domínio; o servidor centraliza dados e comportamento repetível entre dispositivos. |
| **Modelo orientado ao domínio clínico** | Instrumentos (TUG, Katz, Berg, Tinetti, MEEM etc.) têm naturalezas diferentes; o modelo de dados e a API tratam esse domínio de forma estruturada, sem “um blob genérico” que esconda regras. |
| **Evoluição guiada pela documentação de produto** | Requisitos formais ficam sob `docs/produto/`; roteiros clínicos de apoio em `docs/protocolos-clinicos/`. Divergências entre texto assistencial e código são resolvidas atualizando a documentação e o software em conjunto. |

### Fluxo típico (macro)

Informação flui assim no uso previsto pelo produto: o profissional autentica no app → trabalha dentro do escopo só dos próprios pacientes → registra avaliações que o servidor valida e grava → consulta histórico e relatórios apoiados por dados já consolidados pelo servidor.

### Onde aprofundar (sem repetir este README)

| Tema | Documento |
|------|-----------|
| Stack sugerida, PDF/e-mail lado servidor, limites conscientes da documentação atual | [`docs/engenharia/arquitetura.md`](docs/engenharia/arquitetura.md) |
| Entidades e relacionamentos esperados antes de migrações | [`docs/engenharia/modelo-de-dados.md`](docs/engenharia/modelo-de-dados.md) |
| Prioridades de implementação, fases A→E, Bun e estrutura de pastas Git | [`docs/engenharia/repositorio-e-fluxo-desenvolvimento.md`](docs/engenharia/repositorio-e-fluxo-desenvolvimento.md) |
| Comportamento e RFs numerados | [`docs/produto/levantamento-requisitos.md`](docs/produto/levantamento-requisitos.md), [`docs/produto/PRD.md`](docs/produto/PRD.md) |
| LGPD / privacidade e dados sensíveis | [`docs/produto/privacidade-e-lgpd.md`](docs/produto/privacidade-e-lgpd.md) |

Medidas operacionais de segurança, **armazenamento de segredos**, detalhes de auditoria/logging e obrigações legais plenas em produção complementam esta visão: ver **`docs/engenharia/arquitetura.md`** e **`docs/produto/privacidade-e-lgpd.md`**.

---

## Leitura rápida

1. **[docs/README.md](docs/README.md)** — índice canônico sob `docs/`.  
2. **[docs/produto/privacidade-e-lgpd.md](docs/produto/privacidade-e-lgpd.md)** — marcos obrigatórios para dados pessoais e sensível saúde (LGPD Brasil).  
3. **[AGENTS.md](AGENTS.md)** — ponto de entrada curto sobre contexto documental automatizado sobre este repo.

