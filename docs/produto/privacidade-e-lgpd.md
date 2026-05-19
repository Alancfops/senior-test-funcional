# Privacidade e tratamento de dados pessoais (LGPD)

**Norma aplicável:** [Lei nº 13.709/2018](http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm) (Lei Geral de Proteção de Dados Pessoais — LGPD).

**Escopo:** orienta decisões de produto e implementação relacionadas ao **tratamento** de dados pessoais no **Sênior Teste Funcional**, em particular dados de **saúde** e identificadores de **profissionais** e **pacientes**. Este texto é **orientação documental interna ao repositório**; políticas institucionais publicáveis ao público ou a titulares (avisos legais completos, canais formais de atendimento, contratos vigentes) devem ser formalizadas no âmbito do **controlador** do tratamento antes de uso em ambiente produtivo com usuários finais.

**Relação com outras páginas:** requisitos de software seguem [`PRD.md`](./PRD.md) e [`levantamento-requisitos.md`](./levantamento-requisitos.md); medidas técnicas mínimas e desenho de sistema estão em [`../engenharia/arquitetura.md`](../engenharia/arquitetura.md) e [`../engenharia/modelo-de-dados.md`](../engenharia/modelo-de-dados.md).

---

## 1. Princípios e importância

O produto registra dados clínicos e funcionais vinculados a pessoas (pacientes idosos) e a profissionais de saúde. Na LGPD:

- Dados relacionados à **saúde** tratados para fins relacionados são, em geral, **dados pessoais sensíveis**, sujeitos a **regra reforçada** (bases legais específicas, medidas adequadas de governança e segurança).
- Todo tratamento deve observar os **princípios** do art. 6º (entre outros: **finalidade**, **adequação**, **necessidade**, **livre acesso**, **qualidade**, **segurança**, **prevenção**, **não discriminação**, **responsabilização**).
- A **lei não é opcional**: incumbe ao responsável pela operação definir papéis (controlador, operador quando houver terceiros), bases legais, retenções e canais para exercício de direitos dos titulares.

O desenho arquitetural do repositório (API como fonte da verdade, **escopo por profissional** autenticado, persistência estruturada) está alinhado à **segurança** e à **limitação do acesso**; isso não dispensa políticas explícitas de privacidade, contratos com provedores de infraestrutura e governança de incidentes quando o sistema estiver implantado para uso real.

---

## 2. Papéis no tratamento

| Papel | Descrição esperada neste projeto |
|--------|-----------------------------------|
| **Controlador** | Quem decide **finalidades** e **meios** do tratamento dos dados das pessoas que usam a plataforma (ex.: clínica, profissional autônomo titular do projeto na implantação, ou organização cliente). É quem deve prestar informações aos titulares e responder a solicitações de direitos, salvo distribuições legais. |
| **Operador** | Quem **trata dados em nome** do controlador (ex.: provedor de hospedagem, SMS/e-mail transacional), mediante **instruções documentadas** e cláusulas contratuais adequadas (art. 41). |
| **Encarregado (DPO)** | Indicado quando a lei ou a natureza volumétrica e sensível do tratamento assim o exijam; pode ser obrigatório em certos contextos (art. 41 §3º — ver regulamentação e orientações da autoridade nacional). |

A documentação técnica em `docs/` **não substitui** a definição formal de controlador nem designação legal de encarregado.

---

## 3. Dados tratados (categorias)

Os requisitos de produto implicam, entre outros:

| Categoria exemplificativa | Exemplos vinculados aos RFs / modelo de dados |
|---------------------------|------------------------------------------------|
| Dados cadastrais de **profissional** | Identificação, contato (`RF001`), credenciais de acesso (`RF002`–`RF003`). |
| Dados cadastrais de **paciente** | Identificação, dados demográficos, **escolaridade** onde aplicável (`RF004`–`RF006`) — utilizada em interpretações (ex.: MEEM). |
| Dados de **saúde / funcionalidade** | Resultados de instrumentos clínicos (TUG, Katz, Berg, Tinetti, MEEM), registros por sessão, histórico, relatórios e interpretações parametrizadas (`RF007`–`RF013`). |
| Metadados técnicos | Logs mínimos, identificadores de sessão conforme política definida pelo controlador — **somente na medida estritamente necessária**, com período de retenção definido. |

**Minimização:** coletar e armazenar apenas o que for necessário às **finalidades** declaradas; evitar cópias redundantes e campos opcionais sem base em necessidade ou obrigação legal.

---

## 4. Finalidades e bases legais (orientação inicial)

Para dados **sensíveis** relacionados à saúde em contexto assistencial/digital de apoio ao cuidado, as bases legais frequentemente citadas são, entre outras previstas no art. 11, o **cumprimento de obrigações regulatórias** pelo controlador quando aplicável ou o tratamento indispensável à **prestação de assistência à saúde** quando houver vínculo com serviços de saúde, **sempre** em conformidade com a legislação setorial aplicável ao titular dos dados e ao controlador.

A **informação aos titulares** (notice de privacidade) deve mencionar:

- Finalidades específicas do tratamento;  
- Bases legais invocadas (por finalidade quando possível);  
- Compartilhamentos (sub-operadores);  
- Prazos de conservação ou critérios para definição;  
- Direitos do titular e modo de exercê-los;  
- Possibilidade de consentimento apenas quando esse for de fato o fundamento utilizado para determinada hipótese (evitar uso indiscriminado de consentimento para dados sensíveis sem análise jurídica).

**Este repositório não presta assessoria jurídica.** A escolha e redação das bases por finalidade devem ser validadas por profissional habilitado no contexto da implantação.

---

## 5. Direitos dos titulares (art. 18)

Implementação técnica e processos devem capacitar o controlador (ou ferramentas por ele utilizadas) a atender solicitações de:

- Confirmação da existência de tratamento, acesso, correção, anonimização, bloqueio ou eliminação;  
- Portabilidade, quando aplicável;  
- Informação sobre uso compartilhado e respectivas consequências da denegação;  
- Informação sobre a possibilidade de não consentir quando o tratamento dispuser dessa fundamentação.

Requisitos de software podem incluir fluxos auxiliares (exportação estruturada, exclusão lógica com trilhas de auditoria conforme obrigações de retenção) — detalhar em evoluções de `levantamento-requisitos.md` quando esse escopo for priorizado.

---

## 6. Segurança, confidencialidade e integridade

Convergem com a LGPD os compromissos técnicos já descritos em [`../engenharia/arquitetura.md`](../engenharia/arquitetura.md), entre outros:

- Comunicação **HTTPS** em produção;  
- Credenciais com **hash** forte em servidor;  
- Autorização **sempre** amarrada ao profissional autenticado (escopo nos dados relacionais);  
- Armazenamento seguro de segredos e tokens em dispositivo onde aplicável;  
- Fornecimento de e-mail recuperação apenas por canais sob controle da API (evitar tratamento paralelo inconsistente).

Produção exige também: **segmentação de ambientes**, **backups**, **planos de resposta a incidentes** e **relatório de impacto à proteção de dados pessoais (RIPD)** quando aplicável e exigido na hipótese concreta, entre outras medidas da LGPD e da ANPD.

---

## 7. Retenção e descarte

- Definir **prazos** ou políticas objetivas (“enquanto a relação de cuidados existir + prazo legal de guarda quando houver”).  
- Tratar dados **anonimizados** com critérios irreversíveis quando forem usar dados para fins estatísticos sem identificação, conforme definições da lei.  
- Evitar backups indefinidos que reproduzem dados sensíveis além da necessidade.

---

## 8. Subprocessadores e transferência internacional

Listar em documentação institucional: provedores de **nuvem**, **e-mail transacional**, **autenticação**, etc. Contratos devem obrigar medidas compatíveis com LGPD.

Transferências internacionais de dados exigem **verificações específicas** (art. 33–36); armazenar dados somente em jurisdições/prestadores avaliados com suporte jurídico.

---

## 9. Atualização deste artefato

Sempre que o produto ganhar novo fluxo de dados, novo integração ou novo território de implantação, **revisar** este arquivo em conjunto com `PRD.md`, `levantamento-requisitos.md` e decisões da engenharia, mantendo linguagem próxima da operação sem expor dados reais nem segredos.

---

## Referências oficiais (links)

- [Texto integral da LGPD — Planalto](http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)  
- [Autoridade Nacional de Proteção de Dados (ANPD)](https://www.gov.br/anpd/pt-br)
