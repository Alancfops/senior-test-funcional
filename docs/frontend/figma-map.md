# Mapa Figma — telas, rotas e RFs

> **Fonte canônica** do handoff visual: arquivo Figma oficial ↔ requisitos (RF) ↔ rotas Expo Router.  
> Comportamento e regras de negócio: [requirements.md](../product/requirements.md). Arquitetura do app: [README.md](README.md).

**Implementação:** skill Cursor `figma-to-frontend` (registry de components e checklists ficam em `.cursor/skills/figma-to-frontend/reference.md`).

---

## Arquivo Figma

| Campo | Valor |
|-------|--------|
| **Projeto** | Senior Teste Funcional |
| **URL** | https://www.figma.com/design/mtMbhRez2Xy2k414cfzcFm/Senior-Test-Funcional |
| **File key** | `mtMbhRez2Xy2k414cfzcFm` |
| **Entrada (telas)** | [node `1:11490`](https://www.figma.com/design/mtMbhRez2Xy2k414cfzcFm/Senior-Test-Funcional?node-id=1-11490) |

> Arquivo legado incorreto: `Klxn2AvnDaMNofnQ91PZS0` (STP — TESTE) — **não usar**.

**Frame específico:** selecione o frame no Figma e use `?node-id=X-Y` na URL (API interna: `X:Y`).

---

## Tabela Frame Figma — auth e fluxo principal

| Frame Figma | RF | Rota implementada | Status |
|-------------|-----|-------------------|--------|
| Login / Bem-Vindo | RF002 | `src/app/(auth)/login.tsx` | integrado |
| Esqueceu a Senha? | RF003 | `src/app/(auth)/forgot-password/index.tsx` | integrado |
| E-mail enviado | RF003 | `src/app/(auth)/forgot-password/sent.tsx` | integrado |
| Digite o código | RF003 | `src/app/(auth)/forgot-password/code.tsx` | integrado |
| Nova Senha | RF003 | `src/app/(auth)/forgot-password/new-password.tsx` | integrado |
| Erro (recuperação) | RF003 | `src/app/(auth)/forgot-password/error.tsx` | integrado |
| Criar Conta / Cadastro fisio | RF001 | `src/app/(auth)/register.tsx` | integrado |
| Início / Home | RF005 | `src/app/(main)/(tabs)/index.tsx` | integrado |
| Histórico | RF005 | `src/app/(main)/(tabs)/history.tsx` | integrado |
| Lista de Pacientes | RF005 | `src/app/(main)/(tabs)/patients.tsx` | integrado |
| Configurações | RF002 ext. | `src/app/(main)/(tabs)/settings.tsx` | integrado (LGPD, info, sair) |
| LGPD e Termos de uso | — | `src/app/(main)/privacy-terms.tsx` | integrado |
| Informações do Sistema | — | `src/app/(main)/system-info.tsx` | integrado |
| Adicionar Paciente | RF004 | `src/app/(main)/patients/new.tsx` | integrado |
| Perfil de Paciente | RF006 | `src/app/(main)/patients/[id].tsx` | integrado |
| Detalhe / resultado teste | RF006 | `src/app/(main)/patients/[id]/assessment/[assessmentId].tsx` | integrado (+ PDF RF013) |
| Aplicar Teste | RF007 + RF008 | `src/app/(main)/assessments/apply.tsx` | integrado |
| Tutorial (passo 1 e 2) | RF009 | `src/app/(main)/assessments/tutorial.tsx` | integrado |
| Coleta questionário | RF010 | `src/app/(main)/assessments/[instrumentCode]/collect.tsx` | integrado |
| Coleta TUG (cronômetro) | RF010 | `src/app/(main)/assessments/[instrumentCode]/collect.tsx` | integrado |
| Resultado avaliação | RF011 | `src/app/(main)/assessments/[instrumentCode]/result.tsx` | integrado |

**Legenda:** `integrado` = consome API real com `EXPO_PUBLIC_MOCK_AUTH=false`. Auth mock (`features/auth/mock.ts`) permanece disponível só se `EXPO_PUBLIC_MOCK_AUTH=true`.

---

## Referências

- [README.md](README.md) — arquitetura e stack do app  
- [requirements.md](../product/requirements.md) — RFs  
