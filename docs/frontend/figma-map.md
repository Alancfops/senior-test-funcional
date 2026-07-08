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

## Tabela Frame Figma — auth (implementado)

| Frame Figma | RF | Rota implementada | Status |
|-------------|-----|-------------------|--------|
| Login / Bem-Vindo | RF002 | `src/app/(auth)/login.tsx` | implementado |
| Esqueceu a Senha? | RF003 | `src/app/(auth)/forgot-password/index.tsx` | UI; API pendente |
| Email enviado | RF003 | `src/app/(auth)/forgot-password/sent.tsx` | UI; API pendente |
| Digite o código | RF003 | `src/app/(auth)/forgot-password/code.tsx` | UI; API pendente |
| Nova Senha | RF003 | `src/app/(auth)/forgot-password/new-password.tsx` | UI; API pendente |
| Erro (recuperação) | RF003 | `src/app/(auth)/forgot-password/error.tsx` | implementado |
| Criar Conta / Cadastro fisio | RF001 | `src/app/(auth)/register.tsx` | implementado |
| Início / Home | RF005 (parcial) | `src/app/(main)/(tabs)/index.tsx` | UI mock; API pendente |
| Adicionar Paciente | RF004 | `src/app/(main)/patients/new.tsx` | UI mock; API pendente |
| Perfil de Paciente (sem testes) | RF006 | `src/app/(main)/patients/[id].tsx` | mock `maria-de-luordes` |
| Perfil de Paciente (com testes) | RF006 | `src/app/(main)/patients/[id].tsx` | mock `albertino-silva` |
| Detalhe / resultado teste | RF006 | `src/app/(main)/patients/[id]/assessment/[assessmentId].tsx` | UI mock |

---

## Mapa RF → rota Expo Router (alvo)

| RF | Nome funcional | Rota Expo (alvo) | Fluxo / pré-requisito |
|----|----------------|------------------|------------------------|
| RF001 | Cadastro fisioterapeuta | `app/(auth)/register.tsx` | → home após sucesso |
| RF002 | Login | `app/(auth)/login.tsx` | → home; link reset |
| RF003 | Recuperar senha | `app/(auth)/forgot-password/*` | token 6 dígitos, nova senha |
| RF004 | Cadastro paciente | modal/rota em `(main)/` ou `patients/new` | campos MEEM escolaridade |
| RF005 | Lista + busca pacientes | `app/(main)/(tabs)/patients.tsx` | lista mock |
| RF006 | Perfil / histórico paciente | `app/(main)/patients/[id].tsx` | vazio ou lista mock |

**Legenda de status (Fase A):** `UI mock` = tela Figma + dados simulados; `integrado` = API real (Fase D).

---

## Referências

- [README.md](README.md) — arquitetura e stack do app  
- [requirements.md](../product/requirements.md) — RFs  
