# Documento de requisitos de produto (PRD)

## Sênior Teste Funcional

**Versão:** 2026-05 (reorganização da documentação)

---

### Aviso de status

Este PRD integra decisões já descritas nos materiais do projeto e **acompanha** o arquivo [requirements.md](./requirements.md), onde estão os RFs tabulados. **Classificação por instrumentos, textos tutoriais e cortes podem evoluir** após homologação clínica. Trate a pasta **`docs/product/`** como referência atual do produto, não como contrato imutável.

---

## 1. Resumo executivo

O **Sênior Teste Funcional** é uma plataforma digital centrada em **aplicativo mobile**, voltada a **fisioterapeutas** que acompanham **pacientes idosos**. O sistema padroniza a aplicação de instrumentos válidos para o MVP (**TUG, Katz, Berg, Tinetti e MEEM**), registra resultados com **interpretação automatizada quando houver tabela parametrizada**, mantém **histórico longitudinal** e permite **relatório em PDF**.

**Canal web:** opcional e **fora do núcleo obrigatório** desta especificação; papel e escopo ficam para decisão futura.

---

## 2. Problema, objetivos e valor

### 2.1 Problema

- Controle clínico disperso e pouco padronizado.
- Dificuldade para comparar a evolução funcional ao longo do tempo.
- Baixa rastreabilidade de protocolos e critérios usados por sessão.

### 2.2 Objetivos

- Digitalizar o fluxo ponta a ponta da avaliação funcional geriátrica.
- Reduzir variações na coleta e no cálculo em relação ao papel.
- Apoiar a decisão clínica com histórico, gráficos e relatórios, **sem substituir** o julgamento profissional.

### 2.3 Proposta de valor

| Benefício | Descrição |
|-----------|-----------|
| Registro estruturado | Dados por paciente, profissional, data e protocolo |
| Interpretação assistida | Classificação quando existir referência cadastrada; semáforo visual opcional |
| Evolução | Gráfico por instrumento (quando há histórico suficiente) e exportação PDF |
| Rastreabilidade MEEM | Escolaridade usada na interpretação registrada por avaliação (confirmada ou corrigida na sessão) |

---

## 3. Personas e público

| Tipo | Descrição |
|------|-----------|
| **Primário** | Fisioterapeuta que cadastra pacientes, aplica testes, consulta histórico e gera relatórios |
| **Secundário (escopo atual)** | Gestor ou clínica — indicadores agregados e relatórios gerenciais; **mantido registrado apenas como referência** e **fora** do núcleo requisitado nos RFs vigentes neste conjunto |

---

## 4. Escopo do MVP

### 4.1 Incluído

- Cadastro de fisioterapeuta, login e recuperação de senha (**RF001–RF003**).
- CRUD/listagem/perfil de pacientes com foto opcional avatar padrão; **escolaridade recomendada** para suporte ao MEEM (**RF004–RF006**).
- Fluxo de avaliação: **instrumento → paciente → tutorial → execução → feedback → histórico / gráfico / PDF** (**RF007–RF013**).
- Cinco instrumentos: TUG, Katz, Berg, Tinetti, MEEM — detalhe clínico em [../clinical-protocols/instruments/](../clinical-protocols/instruments/).
- Registrar **data, horário e profissional** por aplicação.
- Classificação e comparativo com a **última avaliação do mesmo instrumento** quando aplicável.

### 4.2 Fora do MVP (neste corte documental)

- Integrações externas (prontuário eletrônico terceiros, SSO corporativo etc.).
- Módulo web gerencial completo.
- BI / analytics corporativo.
- Catálogo formal amplamente detalhado de **requisitos não funcionais** e **segurança** — previsto como fase posterior (já há requisitos mínimos embutidos nos RFs).

---

## 5. Fluxo principal da avaliação (MVP)

Ordem obrigatória:

1. **RF007** — Seleção do instrumento (lista validada + busca por nome ou autor).  
2. **RF008** — Seleção do paciente (lista do profissional logado).  
3. **RF009** — Tutorial dinâmico (instruções, comandos verbais, materiais).  
4. **RF010** — Execução com coleta conforme protocolo; bloqueio de finalização até preenchimento completo.  
5. **RF011** — Feedback (resultado bruto, interpretação quando houver).  
6. Opcionalmente: **RF012** evolução, **RF013** PDF.

**Regra:** não iniciar execução sem instrumento **e** paciente definidos; tutorial é etapa esperada antes da coleta.

---

## 6. Instrumentos — visão técnica (resumo)

| Instrumento | Resultado principal | Observação rápida |
|-------------|---------------------|-------------------|
| TUG | Média (s) de 3 ensaios | Tentativa prévia antes dos ensaios reais quando o protocolo adotado prever |
| Katz | Estrato 0–6 (contagem de domínios **Dependentes**) | I/A/D registrados por item |
| Berg | Soma 0–56 | 14 itens × 0–4 |
| Tinetti | Soma equilíbrio + marcha (0–28) | Preferir progresso tipo “item X de 16” |
| MEEM | Soma 0–30 | Cortes Brucki et al. conforme escolaridade; não exibir pontuação parcial/totalização interpretativa até o encerramento, salvo mudança explícita de UX |

Implementação campo a campo e tabelas de corte por versão: ver arquivos em [../clinical-protocols/instruments/](../clinical-protocols/instruments/).

---

## 7. Catálogo de requisitos funcionais (referência rápida)

A numeração completa com tabelas de campos e regras está em **[requirements.md](./requirements.md)** (seções dos RF001 ao RF013). Abaixo, mapa sintético.

| ID | Nome |
|----|------|
| RF001 | Cadastro do fisioterapeuta |
| RF002 | Login |
| RF003 | Recuperação de senha |
| RF004 | Cadastro de paciente |
| RF005 | Listagem / pesquisa de pacientes |
| RF006 | Perfil / histórico do paciente |
| RF007 | Seleção de instrumento |
| RF008 | Seleção do paciente para avaliação |
| RF009 | Tutorial do instrumento |
| RF010 | Execução dos testes |
| RF011 | Feedback e classificação |
| RF012 | Gráfico evolutivo |
| RF013 | Relatório PDF |

**Destaque MEEM:** escolaridade no cadastro (**RF004**); confirmação/ajuste na sessão (**RF010**); valor efetivo da interpretação no PDF (**RF013**). Se ausente no cadastro, o fluxo exige obter o dado antes de aplicar cortes.

---

## 8. Regras de negócio críticas

1. Um fisioterapeuta só acessa **seus** pacientes.  
2. Avaliação sem paciente vinculado não prossegue até a seleção estar completa.  
3. Classificações seguem **tabelas de referência por instrumento** versionadas/parametrizáveis onde couber (ex.: TUG com limites ajustáveis).  
4. Gráfico de linha só com **≥ 2 avaliações** do **mesmo** instrumento para o mesmo paciente.  
5. “Finalizar avaliação” somente quando **todas** as respostas obrigatórias do protocolo forem válidas.

---

## 9. Critérios de aceitação (por módulo)

| Módulo | Critérios (alto nível) |
|--------|-----------------------|
| Autenticação | Email único no cadastro; mensagens consistentes para falha sem vazamento indevido; token de recuperação 6 dígitos, 10 min, uso invalidado após troca |
| Pacientes | Validações de formulário; lista filtrável e ordenável; perfil carrega avaliações do paciente correto |
| Avaliação | Tutorial varia por instrumento; formulário específico por protocolo; persistência ao concluir feedback |
| Evolução / PDF | Eixos e legendas coherentes por instrumento; PDF omite gráfico se não há histórico suficiente; PDF MEEM registra escolaridade usada na interpretação |

Detalhar casos extremos conforme cenários formais de teste de aceitação e revisão técnica.

---

## 10. Arquitetura lógica (conceitual)

- **Cliente mobile**: experiência principal (auth, pacientes, tutoriais, coleta, visualização).
- **API / backend**: regras de negócio, persistência, cálculos, geração de PDF e controle de acesso.
- **Dados**: usuários profissionais, pacientes, sessões de avaliação, pontuações, metadados de instrumentos.

---

## 11. Métricas e sucesso sugeridos (orientação inicial)

Consulte metas prévias (ex.: taxa de conclusão do fluxo, tempo médio por avaliação, erros em PDF) e **recaliibre** quando houver uso real ou piloto — números no material original funcionam como alvo de produto inicial, não como SLA contratual nesta versão sem RNF formais.

---

## 12. Riscos e dependências

| Risco | Mitigação (direção) |
|-------|---------------------|
| Divergência de interpretação clínica entre versões | Versionar tabelas e textos tutor; changelog clínico |
| Dados incompletos (“clique rápido”) | Validação por etapa; mensagens objetivas |
| Performance com histórico longo | Paginação/filtragem; consultas eficientes (detalhar em RNF futura) |

**Dependências:** conteúdo clínico homologado por instrumento; serviço de e-mail para recuperação de senha; bibliotecas de gráfico e PDF adequadas aos clientes-alvo.

---

## 13. Priorização incremental (orientação macro)

Alinhado a [repository-and-workflow](../engineering/repository-and-workflow.md) §3. Não substitui `requirements.md`.

| Fase macro | Foco |
|-------------|------|
| **A** | App Expo: telas Figma (RF001–RF013), navegação, mocks controlados |
| **B** | Backend RF001–RF005 (identidade do profissional, pacientes) + OpenAPI |
| **C** | Backend RF007–RF013 (avaliações, finalize, PDF) |
| **D** | Integração app ↔ API; substituir mocks |
| **E** | Polish visual; RNF formais e endurecimento operacional quando aplicável |

---

## 14. Privacidade e LGPD

Tratamento de dados pessoais e sensíveis (saúde), papéis, medidas técnicas e inventário alinhado ao sistema: **[privacy-and-lgpd.md](./privacy-and-lgpd.md)**.

---

## 15. Pontos sob refinamento ou dependência externa

- Uniformização das faixas de classificação e do material didático dos tutoriais após validação clínica e acadêmica.
- Definição de SLAs e políticas operacionais de retenção e backup quando requisitos não funcionais forem formalizados no escopo.
- Papel preciso de canais adicionais (ex.: web) em relação ao núcleo mobile.

---

## Referências cruzadas

- Especificação tabular RF001–RF013: [requirements.md](./requirements.md).  
- LGPD / dados pessoais e sensíveis: [privacy-and-lgpd.md](./privacy-and-lgpd.md).  
- Roteiros clínicos: [../clinical-protocols/instruments/](../clinical-protocols/instruments/).  
