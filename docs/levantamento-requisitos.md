# Documento de requisitos

## Sênior Teste Funcional

**Érika Prado**

---

### Aviso de alteração

**Este documento é passível de mudanças.** Prioridades de produto, regras de negócio, textos auxiliares e detalhes de formulário podem ser revisados conforme decisão da equipe, orientação da disciplina ou validação clínica. Para visão sintética e decisões de produto, ver também [PRD.md](./PRD.md).

---

## 1. Introdução

Este documento especifica os requisitos do sistema **Sênior Teste Funcional**, oferecendo ao time o necessário para projeto, implementação, testes e homologação.  
A ideia é manter o texto enxuto no que for repetitivo e preciso onde o detalhe evita retrabalho — principalmente na parte dos instrumentos clínicos, que é onde o sistema mais encosta no cuidado em si.

### 1.1 Visão geral do documento

- **Seção 2** — Descrição geral do sistema (escopo, usuários, canais).  
- **Seção 3** — Requisitos funcionais (RF001 a RF013), com campos, regras e observações.  
- **Seção 4** — Requisitos não funcionais: neste momento o detalhamento fica **fora do foco** a pedido da orientação do projeto; a seção registra o espaço para evolução futura.  
- **Seção 5** — Requisitos de segurança: mesmo raciocínio — catálogo formal pode vir depois; o que já aparece nos RFs (senha, token, sessão) continua valendo.  
- **Seções 6 a 8** — Matrizes, pontos de função e referências, conforme modelo adotado na disciplina.

### 1.2 Convenções, termos e abreviações

#### 1.2.1 Identificação dos requisitos

A referência segue o padrão **[nome da subseção. identificador]**, com identificador único:

- **RF** — requisito funcional (RF001, RF002, …)  
- **RNF** — requisito não funcional (quando formalizado)  
- **RS** — requisito de segurança (quando formalizado)

#### 1.2.2 Prioridades

Quando aplicável:

- **Essencial** — sem isso o sistema não “liga” de forma aceitável.  
- **Importante** — liga, mas a experiência fica aquém do esperado.  
- **Desejável** — melhora o produto; pode ir para versão posterior se o prazo apertar.

#### 1.2.3 Anexo técnico dos instrumentos

O detalhamento item a item dos testes (texto das perguntas, critérios 0–4 da Berg, blocos do MEEM, etc.) está consolidado na pasta **[testes/](testes/)** do repositório (subpastas `tug`, `katz`, `berg`, `tinetti`, `meem`), com **fonte bibliográfica** indicada em cada roteiro. Este documento define **o que o sistema deve fazer**; aqueles arquivos amparam **como o protocolo se aplica** na prática.

---

## 2. Descrição geral do sistema

### 2.1 Abrangência e sistemas relacionados

A solução é uma plataforma digital voltada a **fisioterapeutas** no acompanhamento de **pacientes idosos**: cadastro, aplicação de **testes clínicos padronizados**, histórico e relatórios.

**Canais:** o uso principal previsto é o **aplicativo mobile** (incluindo cadastro do profissional e rotina clínica em campo ou consultório). Uma **versão web** pode existir mais adiante como apoio (consulta, gestão, relatórios), mas **não faz parte do núcleo obrigatório** nesta especificação.

A plataforma permite:

- cadastro e gestão de usuários (fisioterapeuta);  
- cadastro de pacientes;  
- escolha do **instrumento**, depois do **paciente**, tutorial, execução, feedback imediato, evolução em gráfico e **PDF**;  
- registro automático de **data, horário e profissional** em cada avaliação.

O histórico individual organiza as aplicações por instrumento e sustenta **gráficos comparativos** para leitura da evolução. Os relatórios em PDF reúnem identificação, resultado bruto, interpretação (quando houver regra cadastrada), observações e, quando couber, o gráfico de evolução. A intenção é apoiar a **decisão clínica** sem substituir o julgamento do profissional.

---

## 3. Requisitos funcionais (casos de uso)

### RF001 — Cadastro do fisioterapeuta

**Campos**

| Campo | Obrigatório | Tipo / regra |
|--------|-------------|--------------|
| Nome completo | Sim | String, máx. 250 caracteres. Não vazio, não só espaços, sem dígitos e sem caracteres especiais. |
| E-mail | Sim | Formato válido, único no sistema. Validar presença de “@” e domínio plausível. |
| Senha | Sim | Mínimo 8 caracteres; pelo menos 4 números, 2 letras, 1 maiúscula e 1 minúscula. |
| Confirmação de senha | Sim | Idêntica à senha. |

**Regras**

1. O e-mail não pode estar cadastrado previamente.  
2. A senha deve ser armazenada de forma **criptografada** (hash seguro — detalhe de implementação).  
3. Validar campos obrigatórios **antes** de enviar o formulário.

---

### RF002 — Login do fisioterapeuta

**Campos**

| Campo | Obrigatório |
|--------|-------------|
| E-mail | Sim |
| Senha | Sim |

**Regras**

1. Validar se o e-mail existe.  
2. Validar se a senha confere.  
3. Em falha, exibir **mensagem de erro** (sem revelar qual campo falhou, se essa for a política de segurança adotada pelo projeto).  
4. Em sucesso, redirecionar para a **tela principal**.  
5. Deve existir o link **“Esqueceu a senha?”**.

---

### RF003 — Recuperação de senha

**Campos**

| Campo | Obrigatório | Observação |
|--------|-------------|------------|
| E-mail | Sim | Dispara envio de **token** para alteração. |
| Validação do token | Sim | **6 dígitos numéricos** informados pelo usuário. |
| Nova senha | Sim | Mesma política de complexidade do RF001. |
| Confirmação da nova senha | Sim | Igual à nova senha. |

**Regras**

1. Só seguir se o e-mail for válido no sistema.  
2. O token informado deve ser o mesmo enviado por e-mail.  
3. Validade do token: **10 minutos**.  
4. Após troca bem-sucedida, **invalidar** o token utilizado.

---

### RF004 — Cadastro de pacientes (idosos)

**Campos**

| Campo | Obrigatório | Tipo / regra |
|--------|-------------|--------------|
| Nome completo | Sim | String, máx. 250. Sem números no nome. |
| Idade | Sim | Inteiro de 0 a 120. |
| Sexo | Sim | Enum: Masculino / Feminino / Outro. |
| Contato | Sim | Aceitar e-mail **ou** telefone celular (formato a validar no app). |
| Escolaridade | Recomendado | Faixa compatível com a interpretação do **MEEM** (cortes por escolaridade — vide [testes/meem/](testes/meem/) e literatura Brucki et al., 2003). **Recomenda-se** preencher no cadastro para não repetir o dado em toda aplicação do MEEM; na abertura do MEEM, o profissional **confirma** o valor e pode **ajustar pontualmente** se houver correção clínica. Se estiver **em branco**, o fluxo do MEEM deve **exigir** o preenchimento (ou direcionar à edição do cadastro) **antes** de aplicar os cortes. |
| Foto | Não | JPG ou PNG. |

**Regras**

1. Validar tudo antes de gravar.  
2. Sem foto: exibir **avatar** genérico.

*Espaço reservado para protótipo de tela, quando solicitado na disciplina.*

---

### RF005 — Listagem e pesquisa de pacientes

**Elementos**

| Elemento | Obrigatório | Descrição |
|-----------|-------------|-----------|
| Pesquisar | Não | Texto: filtra por nome em **tempo real**. |
| Resultados por página | Sim | Ex.: 10, 25, 50 registros. |
| Colunas Nome, Idade, Sexo | Automático | Idade e sexo vêm do cadastro. |

**Regras**

1. Listar **somente** pacientes do fisioterapeuta logado.  
2. Ordenação **crescente/decrescente** ao tocar nos cabeçalhos (Nome, Idade, Sexo).  
3. Lista vazia ou busca sem resultado: mensagem centralizada **“Nenhum registro encontrado”**.

*Observação de produto: não exibir coluna de “ID” interno na lista voltada ao profissional — o que importa na rotina é nome, idade e sexo.*

---

### RF006 — Perfil e histórico do paciente

**Elementos**

| Elemento | Descrição |
|-----------|-----------|
| Foto / avatar | Como no cadastro. |
| Dados cadastrais | Nome, idade, sexo, contato (e escolaridade, se cadastrada). |
| Botão “Nova avaliação” | Encaminha para a **listagem de instrumentos** (**RF007**). |
| Lista de avaliações | Ordem **da mais recente para a mais antiga**: instrumento, data, resultado (pontuação ou tempo ou estrato, conforme o caso) e classificação quando houver. |
| Área de detalhe | Ao selecionar uma linha: **gráfico de linha** daquele instrumento (se aplicável) + respostas e observações **daquela** aplicação. |

**Regras**

1. Carregar dados do paciente escolhido na lista (RF005).  
2. Gráfico de evolução **só** se existirem **duas ou mais** aplicações **do mesmo instrumento** para esse paciente.  
3. Sem avaliações: mensagem **“Nenhuma avaliação realizada para este paciente”**.

---

### RF007 — Seleção de instrumentos de avaliação

**Elementos**

| Elemento | Descrição |
|-----------|-----------|
| Lista de instrumentos | Nome do instrumento + **autor(es)**. Somente instrumentos **validados** no MVP: **TUG, Katz, Berg, Tinetti, MEEM** (lista pode crescer depois). Ordem **alfabética** pelo nome do teste. |
| Pesquisa | Opcional; filtra por nome do instrumento **ou** autor, em tempo real. |
| Selecionar | Confirma o instrumento e segue para **RF008**. |

**Regras**

1. Se a busca não achar nada: **“Nenhum instrumento encontrado”**.  
2. Autor(es) junto ao nome é **obrigatório** (rastreabilidade e boa prática acadêmica).  
3. A avaliação **só começa na prática** depois de escolhidos instrumento **e** paciente e concluído o tutorial — ou seja, “não dá para pular” para a coleta sem essa sequência.

---

### RF008 — Seleção do paciente para a avaliação

**Elementos**

| Elemento | Descrição |
|-----------|-----------|
| Lista | Nome, idade, sexo dos pacientes do profissional logado. |
| Pesquisar paciente | Opcional; filtro em tempo real pelo nome. |
| Confirmar seleção | Vincula o paciente ao instrumento já escolhido em RF007. |

**Regras**

1. Lista vazia ou busca sem match: **“Nenhum registro encontrado”**.  
2. Permitir **scroll** quando houver muitos pacientes.  
3. Após confirmar: ir obrigatoriamente para o **tutorial** (**RF009**).

**Fluxo resumido (MVP):** RF007 (instrumento) → RF008 (paciente) → RF009 (tutorial) → RF010 (execução).

---

### RF009 — Tutorial do instrumento

**Elementos**

| Elemento | Obrigatório |
|-----------|-------------|
| Identificação do instrumento | Sim — nome completo + autores. |
| Preparação e equipamentos | Sim — materiais e organização do ambiente. |
| Instruções passo a passo | Sim — como conduzir e o que observar no idoso. |
| Guia visual | Não — figuras JPG/PNG quando existirem (percurso de 3 m, etc.). |
| Comandos verbais ao paciente | Sim — falas padronizadas em destaque (negrito ou cor). |
| Iniciar avaliação | Sim — abre **RF010**. |

**Regras**

1. Conteúdo **dinâmico** conforme o instrumento escolhido em RF007.  
2. Navegação entre passos (**Próximo** / **Anterior**).  
3. Possibilidade de **voltar** à lista de instrumentos se faltar material.  

---

### RF010 — Execução do teste

**Cabeçalho fixo:** nome do instrumento + nome do paciente.

**Área de coleta** — varia por instrumento:

**TUG**  
- Cronômetro com **Iniciar** / **Parar**.  
- **Três ensaios reais** (após ensaio de familiarização, se o protocolo adotado previr).  
- Exibir os **três tempos** antes de finalizar.  
- Resultado para classificação: **média aritmética** dos três tempos (em segundos).

**Katz**  
- Seis domínios: Banho, Vestir-se, Uso do vaso sanitário, Transferência, Continência, Alimentação.  
- Em cada um: **(I) Independente**, **(A) Assistência**, **(D) Dependente**, com texto de apoio conforme protocolo (vide [testes/katz/avaliar.md](testes/katz/avaliar.md)).  
- **Resultado numérico para gráfico/evolução:** contar quantos domínios estão em **(D)** → estrato **0 a 6** (0 = independente em todos; 6 = dependente em todos). A opção **(A)** entra na **coleta** e no relatório descritivo; **os estratos 0–6** seguem a regra acordada com o protocolo de referência do projeto (contagem de dependentes).

**Berg**  
- 14 itens, notas **0 a 4** por item, com texto descritivo por nota.  
- Pontuação: **soma** (0–56).

**Tinetti**  
- Duas partes: **Equilíbrio** (9 itens, soma 0–16) e **Marcha** (7 itens, soma 0–12).  
- Cada resposta com descrição e pontuação **0, 1 ou 2** conforme o item.  
- Total **0–28**.  
- Indicador de progresso: preferir **“Item X de 16”** (em vez de “pergunta”), alinhado aos 16 itens totais.

**MEEM**  
- Blocos na ordem do protocolo adotado (Folstein; referências em [testes/meem/](testes/meem/)).  
- **Limites de pontuação por bloco** (total 30):  
  - Orientação (temporal e espacial): **10**  
  - Registros: **3**  
  - Atenção e cálculo: **5**  
  - Evocação (lembrança das 3 palavras): **3**  
  - Linguagem (nomeação, repetição, comando em três etapas, leitura/obediência, escrita, cópia): **9**  
- Coleta por **acertos** dentro de cada bloco, **sem ultrapassar** o teto do bloco.  
- **Escolaridade:** priorizar dado do **cadastro** (RF004), com **confirmação** na tela do MEEM; correção pontual na sessão deve ser **gravada na avaliação** (e pode opcionalmente atualizar o cadastro).  
- **Não** mostrar pontuação parcial nem classificação **durante** a aplicação (só ao final), salvo decisão explícita futura de UX.

**Em todos os instrumentos**

- **Instrução técnica** visível por item (comando ou observação para o avaliador).  
- **Contador** de progresso (ex.: “Ensaio 2 de 3” no TUG).  
- Botão **Finalizar avaliação**: só habilitado quando **todos** os campos obrigatórios estiverem válidos (nos três tempos do TUG, nos 16 itens do Tinetti, etc.).

**Processamento ao finalizar**

| Instrumento | Resultado bruto principal |
|-------------|---------------------------|
| TUG | Média dos 3 tempos (s) |
| Katz | Estrato 0–6 (contagem de **D**) |
| Berg | Soma 0–56 |
| Tinetti | Soma equilíbrio + marcha (0–28) |
| MEEM | Soma 0–30 + faixa de escolaridade usada nos cortes |

---

### RF011 — Feedback imediato e classificação

**Elementos**

- **Resumo:** resultado bruto (ex.: “12,5 s”, “48/56”).  
- **Classificação** automática quando existir tabela cadastrada para o instrumento, com **cores** de apoio (verde / amarelo / vermelho — sem obrigar nomenclatura rígida se o protocolo usar outra escala).  
- **Comparativo rápido** (opcional): melhor / igual / pior que a última avaliação **do mesmo instrumento**.  
- **Ver evolução** — leva ao histórico (RF006).  
- **Gerar relatório PDF** — atalho (RF013).

**Regras**

1. Cruzar resultado com **tabelas de referência** versionadas por instrumento.  
2. Persistir resultado ao concluir esta etapa.  

---

### RF012 — Gráfico evolutivo

**Elementos**

- Cabeçalho: paciente + instrumento.  
- Eixo X: **tempo** (datas das sessões).  
- Eixo Y: valor do desempenho conforme o instrumento:  
  - TUG: **segundos**  
  - Berg: **0–56**  
  - Tinetti: **0–28**  
  - MEEM: **0–30**  
  - Katz: **0–6** (número de domínios **dependentes**; **quanto menor, melhor** o panorama de independência)  
- **Legenda** explicando em linguagem simples: para **TUG e Katz**, **queda** da curva costuma indicar **melhora**; para **Berg, Tinetti e MEEM**, **subida** costuma indicar **melhora**.  
- **Tooltip** no ponto: data, valor, classificação daquele dia.

**Regras**

1. Ajustar escala automaticamente dentro dos limites do instrumento.  
2. Incluir nova medida ao concluir uma avaliação.  
3. Só uma aplicação: mensagem do tipo **“Realize mais avaliações para exibir o gráfico de linha”** (alinhado ao RF006).  

---

### RF013 — Relatório PDF

**Conteúdo**

- Cabeçalho: identidade visual do sistema + nome do fisioterapeuta.  
- Paciente: nome, idade, sexo; **escolaridade** quando **relevante** (no mínimo nos relatórios de **MEEM**, usando o valor **efetivo da interpretação** naquela aplicação — cadastro confirmado ou ajuste na sessão). Nos demais instrumentos, pode constar escolaridade do cadastro se disponível, ou ser omitida conforme política de privacidade do serviço.  
- Avaliação: instrumento, **autores**, data/hora, resultado bruto.  
- Interpretação clínica automática quando houver.  
- Gráfico de evolução: **só** se houver **duas ou mais** avaliações daquele instrumento para o paciente; senão, mensagem **“Sem dados suficientes para evolução”**.  
- Área de **assinatura e carimbo** ao final.

**Regras**

1. PDF em **A4**, layout consistente.  
2. Amarrar o PDF ao **profissional autenticado** e ao **paciente**.  
3. Manter rastreabilidade do **protocolo** (nome + autores).  

---

## 4. Requisitos não funcionais (RNF)

*Nesta etapa do trabalho a orientação pediu **foco nos requisitos funcionais**.*  
A lista numerada tipo RNF01, RNF02 (desempenho, disponibilidade, usabilidade detalhada, etc.) fica **registrada aqui como pendência de documentação** para quando o escopo evoluir.

Sugestão para a próxima versão do documento: desdobrar em desempenho (tempo de resposta alvo), disponibilidade, usabilidade em contexto domiciliar, acessibilidade básica e compatibilidade com versões de SO do celular.

---

## 5. Requisitos de segurança (RS)

Mesmo critério da seção anterior: **catálogo RS001…** pode ser formalizado depois.  
Já ficam explícitos, via RF001–RF003: **hash de senha**, **token de recuperação** com expiração, **sessão** e **comunicação segura** (HTTPS) na implementação — detalhes de hardening (OWASP, LGPD, backup) entram quando o orientador abrir espaço para essa camada.

---

## 6. Matriz de avaliação de risco

(Manter o modelo da disciplina: probabilidade × impacto, com classes Catastrófico / Crítico / … e Frequente / Provável / … — preencher na versão entregue ao professor com os riscos que o grupo julgar relevantes, por exemplo divergência de interpretação clínica entre versões do app, perda de dado, vazamento de credencial.)

---

## 7. Matriz de rastreabilidade (requisitos funcionais)

| RF001 | Cadastro profissional |
| RF002 | Login |
| RF003 | Recuperação de senha |
| RF004 | Cadastro paciente |
| RF005 | Lista / busca pacientes |
| RF006 | Perfil / histórico |
| RF007 | Escolha do instrumento |
| RF008 | Escolha do paciente |
| RF009 | Tutorial |
| RF010 | Execução dos testes |
| RF011 | Feedback |
| RF012 | Gráfico |
| RF013 | PDF |

*(Completar com vínculos “RF010 → instrumentos específicos” se a disciplina exigir rastro fino.)*

---

## 8. Pontos de função (APF)

Manter a metodologia e a tabela de contagem adotadas na disciplina (ALI, AIE, EE, SE, CE, complexidade). Os RF001 em diante continuam sendo a base para a contagem por módulo; valores numéricos e totais seguem o que o grupo calcular na planilha oficial.

---

## 9. Referências

- Materiais de modelo de documento de requisitos utilizados na disciplina.  
- Protocolos e pontos de corte: ver **[testes/](testes/)** (cada subpasta traz referência bibliográfica no `avaliar.md` ou no resumo `*.md`).  
- Brucki, S. M. D. et al. Sugestões para o uso do Mini-Exame do Estado Mental no Brasil. *Arq Neuro-Psiquiatr.*, 2003.  
- Folstein, M. F. et al. Mini-Mental State. *J Psychiatr Res.*, 1975.  
- Outras fontes por instrumento: Podsiadlo & Richardson (TUG); Tinetti (1986); Katz et al. (1963); Berg et al. (1992); Miyamoto et al. (versão brasileira da Berg), conforme citado nos roteiros em [testes/](testes/).

---

*Documento revisado para alinhar numeração dos RFs, fluxo instrumento → paciente, regras de cálculo (MEEM e Katz), escolaridade no cadastro com uso no MEEM, e anexo técnico em [testes/](testes/). Conteúdo sujeito a alterações.*
