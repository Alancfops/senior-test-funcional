# Sênior Teste Funcional

Plataforma digital para **fisioterapeutas** acompanharem pacientes idosos com instrumentos funcionais padronizados (histórico, evolução e relatórios).

**Este repositório concentra documentação** — requisitos, arquitetura, LGPD e protocolos clínicos. O código da API e do app será versionado **em outro momento / outro repositório** (ou pastas definidas pela equipe), alinhado a esta especificação.

---

## Documentação

Índice completo: **[docs/README.md](docs/README.md)**

| Tema | Onde |
|------|------|
| Produto e RFs | [docs/product/](docs/product/) |
| Como a **API** deve funcionar | [docs/backend/README.md](docs/backend/README.md) |
| Como o **app mobile** deve funcionar | [docs/frontend/README.md](docs/frontend/README.md) |
| Arquitetura e stack | [docs/engineering/architecture.md](docs/engineering/architecture.md) |
| LGPD | [docs/product/privacy-and-lgpd.md](docs/product/privacy-and-lgpd.md) |

---

## Arquitetura (resumo)

| Camada | Função |
|--------|--------|
| **App mobile** | Interface do fisioterapeuta; consome a API |
| **API** | Regras, persistência, PDF, permissões por profissional |
| **PostgreSQL** | Dados de contas, pacientes e avaliações |

O servidor é a **fonte da verdade** clínica. Detalhes: [docs/engineering/architecture.md](docs/engineering/architecture.md).

---

## Leitura rápida

1. [docs/README.md](docs/README.md)  
2. [docs/product/privacy-and-lgpd.md](docs/product/privacy-and-lgpd.md)  
3. [AGENTS.md](AGENTS.md) — entrada para agentes automatizados  
