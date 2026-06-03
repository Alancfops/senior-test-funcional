# Contratos de interface (machine-readable)

Pasta destinada a **artefatos consumíveis automaticamente** por ferramentas: geração de tipos de cliente (TypeScript/outros), checagens de conformidade sob CI ou referência rápida sem depender apenas de servidor em execução.

**Situação atual:** estrutura mínima intencional enquanto o servidor não publica primeira OpenAPI oficial; não indica menor prioridade técnica para **contratos explícitos** — apenas ausência física momento zero.

```
openapi/openapi-v1.yaml        # Exemplo típico: snapshot Swagger/Nest bundle CI
schemas/minimal/request/*.json # Exemplos de payload paralelos Zod opcionais QA
```

**Propagação sugerida**

- Artefatos **dinâmicos** primários ficam junto código gerador servidor (`backend/`) sempre que servidor rodar ou build exportar swagger.  
- **`docs/contracts/`** acumula **snapshots versionados** apenas quando institucionalmente útil antes de rupturas semver da API (**diff público revisível**).

