# Contratos de interface (machine‑readable)

Propósito: armazenar **artefatos que geram cliente tipado**, validação CI e clareza p/ designing mobile sem abrir servidor.

Estado inicial **vazio propositalmente** até existir codebase API.

Futuros exemplos sugeridos (imparciais formato):

```
openapi/openapi-v1.yaml        # Snapshot exportável do Swagger Nest
schemas/minimal/request/*.json # Payloads exemplo validados zod paralelo (opcional)
```

**Propagação:**
- Primário vivo fica sempre no **Swagger gerado código `backend/`** quando rodando desenvolvimento.  
- Pasta `docs/contratos/` pode servir de **checkpoint antes de release maior** (diff legível do contrato).
