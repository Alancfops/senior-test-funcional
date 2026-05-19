# Sênior Teste Funcional

Plataforma digital para **fisioterapeutas** acompanharem pacientes idosos com instrumentos funcionais padronizados (histórico, evolução e relatórios), conforme documentação em **`docs/`**.

---

## Organização deste repositório

| Pasta | Papel |
|-------|--------|
| **[backend/](backend/)** | API e regras de negócio (prioridade de desenvolvimento) |
| **[frontend/](frontend/)** | App React Native (Expo): primeiro **telas rascunho**, depois **UI guiada pelo design** |
| **[docs/](docs/)** | Especificação: produto (PRD e RFs em `levantamento-*`), engenharia, protocolos clínicos, espaço futuro para contratos de API |

**Monorepo com Bun workspaces** quando o código scaffold existir (um `package.json` na raiz listando `backend` e `frontend`). Detalhes de setup em **[docs/engenharia/arquitetura.md](docs/engenharia/arquitetura.md)** e fluxo **A→E** em **[docs/engenharia/repositorio-e-fluxo-desenvolvimento.md](docs/engenharia/repositorio-e-fluxo-desenvolvimento.md)**.

---

## Arquitetura do projeto (visão de sistema)

Este trecho resume **forma e responsabilidades** do software para quem chega pela primeira vez ou para uso com assistências ao desenvolvimento (por exemplo ferramentas de IA) que precisam de contexto inicial. **Não** descreve configurações operacionais, segredos, credenciais nem políticas institucionais de dados — isto pertence à documentação técnica interna quando o projeto estiver implantado.

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
| **Fronteira clara cliente/servidor** | O cliente pensa em fluxo de telas e experiência; o servidor centraliza dados e comportamento repetível entre dispositivos. |
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
| Comportamento e RFs númerados | [`docs/produto/levantamento-requisitos.md`](docs/produto/levantamento-requisitos.md), [`docs/produto/PRD.md`](docs/produto/PRD.md) |

Políticas de segurança, **armazenamento de segredos**, log detalhado e conformidade institucional entram quando houver projeto de **deploy** próprio ou exigências regulatórias explícitas; não ficam escritas aqui nesta visão neutra.

---

## Leitura rápida

1. **[docs/README.md](docs/README.md)** — índice canônico de toda documentação interna (`docs/`).  
2. **[AGENTS.md](AGENTS.md)** — ponte curta sobre onde ler contexto automatizado neste repo.

