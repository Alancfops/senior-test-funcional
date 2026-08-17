export type QuestionnaireInstrumentCode = 'katz' | 'berg' | 'tinetti' | 'meem';

export type ScoringGuideEntry = {
  score: string;
  description: string;
};

export type TutorialStep = {
  /** Parágrafo introdutório ou texto antes dos bullets. */
  body: string;
  /** Bullets opcionais (passo 2 — classificação / interpretação). */
  bullets?: readonly string[];
  /** Guia resumido de pontuação por nível (complemento ao protocolo). */
  scoringGuide?: readonly ScoringGuideEntry[];
  /** Nota opcional abaixo do guia de pontuação. */
  scoringGuideNote?: string;
};

export type TutorialInstrument = {
  code: string;
  name: string;
  tutorial: {
    step1: TutorialStep;
    step2: TutorialStep;
  };
};

export type QuestionnaireInstrument = TutorialInstrument & {
  code: QuestionnaireInstrumentCode;
};

/** Instrumentos de questionário (RF007/RF009). Coleta em formulário paginado (RF010). */
export const QUESTIONNAIRE_INSTRUMENTS: readonly QuestionnaireInstrument[] = [
  {
    code: 'berg',
    name: 'Escala de Equilíbrio de Berg',
    tutorial: {
      step1: {
        body:
          'A Escala de Equilíbrio de Berg (EEB) é um teste padrão-ouro na fisioterapia para avaliar equilíbrio estático e dinâmico e o risco de quedas.',
        bullets: [
          'Composta por 14 tarefas do cotidiano (sentar, levantar, alcançar objetos, etc.).',
          'Cada tarefa recebe pontuação de 0 a 4 conforme o desempenho observado.',
          'Quanto menor o escore total, maior o risco de quedas.',
        ],
        scoringGuide: [
          { score: '0', description: 'Incapaz de completar a tarefa ou necessita ajuda máxima.' },
          { score: '1', description: 'Executa com ajuda mínima ou de forma muito limitada.' },
          { score: '2', description: 'Completa com dificuldade, supervisão ou várias tentativas.' },
          { score: '3', description: 'Completa com uso das mãos ou supervisão leve.' },
          { score: '4', description: 'Execução independente e segura (desempenho máximo do item).' },
        ],
        scoringGuideNote:
          'Cada um dos 14 itens usa esta escala 0–4 conforme o protocolo Berg (Miyamoto et al., 2004).',
      },
      step2: {
        body: 'A nota máxima é 56 pontos, e quanto menor o escore, maior o risco de quedas:',
        bullets: [
          '0 a 20 pontos: risco gravíssimo, indicando possível necessidade de cadeira de rodas.',
          '21 a 40 pontos: risco moderado a alto, indicando necessidade de auxílio para marcha (andador ou bengala).',
          '41 a 56 pontos: baixo risco, sugerindo independência e segurança para locomoção.',
        ],
      },
    },
  },
  {
    code: 'katz',
    name: 'Índice de Katz',
    tutorial: {
      step1: {
        body:
          'O Índice de Katz avalia a independência do paciente em Atividades Básicas de Vida Diária (ABVD).',
        bullets: [
          'Seis domínios: banho, vestir-se, uso do vaso sanitário, transferência, continência e alimentação.',
          'Para cada item, registre se o paciente é Independente, necessita de Assistência ou é Dependente.',
          'A classificação final considera apenas as atividades marcadas como Dependente.',
        ],
        scoringGuide: [
          { score: 'Independente', description: 'Realiza a atividade sem ajuda de outra pessoa.' },
          {
            score: 'Assistência',
            description: 'Precisa de supervisão ou ajuda parcial em parte da atividade.',
          },
          { score: 'Dependente', description: 'Precisa de ajuda total ou não realiza a atividade.' },
        ],
        scoringGuideNote:
          'O estrato final (0–6) conta somente os domínios classificados como Dependente.',
      },
      step2: {
        body:
          'O estrato final varia de 0 a 6, conforme a quantidade de atividades classificadas como Dependente (respostas em Assistência não entram na contagem):',
        bullets: [
          '0: independente em todas as atividades.',
          '1: dependente em uma atividade.',
          '2: dependente em duas atividades.',
          '3: dependente em três atividades.',
          '4: dependente em quatro atividades.',
          '5: dependente em cinco atividades.',
          '6: dependente em todas as atividades.',
        ],
      },
    },
  },
  {
    code: 'tinetti',
    name: 'Escala de Tinetti (ou POMA)',
    tutorial: {
      step1: {
        body:
          'O Teste de Tinetti (Performance-Oriented Mobility Assessment — POMA) avalia equilíbrio e marcha em ambiente supervisionado.',
        bullets: [
          'Parte de equilíbrio: 9 itens, até 16 pontos.',
          'Parte de marcha: 7 itens, até 12 pontos.',
          'Cada item é pontuado conforme o desempenho observado (0, 1 ou 2 pontos).',
        ],
        scoringGuide: [
          { score: '0', description: 'Ausência ou incapacidade na habilidade observada.' },
          { score: '1', description: 'Desempenho parcial ou com compensações.' },
          { score: '2', description: 'Desempenho adequado e seguro.' },
        ],
        scoringGuideNote:
          'Alguns itens usam escala 0–1 ou 0–4 conforme o protocolo Tinetti — o app limita as opções por item.',
      },
      step2: {
        body: 'O escore total máximo é 28 pontos (equilíbrio + marcha). A classificação de risco de queda segue:',
        bullets: [
          'Menor que 19: alto risco de queda.',
          '19 a 24: risco moderado.',
          '25 a 28: baixo risco de queda.',
        ],
      },
    },
  },
  {
    code: 'meem',
    name: 'Mini Exame do Estado Mental (MEEM)',
    tutorial: {
      step1: {
        body:
          'O Mini Exame do Estado Mental (MEEM) é um instrumento de triagem cognitiva aplicado de forma padronizada.',
        bullets: [
          'Avalia orientação temporal e espacial, registro, atenção e cálculo, memória de evocação e linguagem.',
          'A pontuação total máxima é 30 pontos.',
          'Confirme a escolaridade do paciente no início da sessão — ela define o corte interpretativo.',
        ],
        scoringGuide: [
          {
            score: '0',
            description: 'Resposta incorreta, ausente ou bloco sem pontos naquele domínio.',
          },
          {
            score: '1+',
            description: 'Pontos parciais ou totais conforme acertos em cada bloco (máx. varia por item).',
          },
        ],
        scoringGuideNote:
          'Itens de orientação valem 0 ou 1 ponto; blocos como Registro (0–3) e Atenção (0–5) somam conforme acertos.',
      },
      step2: {
        body:
          'Os pontos de corte para interpretação no Brasil (Brucki et al., 2003) variam conforme a escolaridade. Pontuação abaixo do corte sugere déficit cognitivo na triagem:',
        bullets: [
          'Analfabeto: corte 20 pontos.',
          '1 a 4 anos de estudo: corte 25 pontos.',
          '5 a 8 anos: corte 26,5 pontos.',
          '9 a 11 anos: corte 28 pontos.',
          'Mais de 11 anos: corte 29 pontos.',
        ],
      },
    },
  },
] as const;

export const QUESTIONNAIRE_INSTRUMENT_OPTIONS = QUESTIONNAIRE_INSTRUMENTS.map((item) => ({
  value: item.code,
  label: item.name,
}));

export function getQuestionnaireInstrument(code: string): QuestionnaireInstrument | undefined {
  return QUESTIONNAIRE_INSTRUMENTS.find((item) => item.code === code);
}

export function isQuestionnaireInstrumentCode(code: string): code is QuestionnaireInstrumentCode {
  return QUESTIONNAIRE_INSTRUMENTS.some((item) => item.code === code);
}

export const TUG_INSTRUMENT: TutorialInstrument = {
  code: 'tug',
  name: 'TUG (Timed Up and Go)',
  tutorial: {
    step1: {
      body:
        'O TUG (Timed Up and Go) avalia mobilidade, equilíbrio dinâmico e risco de quedas pelo tempo de locomoção.',
      bullets: [
        'O paciente levanta de uma cadeira, caminha 3 metros, gira, retorna e senta.',
        'Realize uma tentativa prática antes dos três ensaios cronometrados.',
        'Use o cronômetro integrado do aplicativo para registrar cada ensaio.',
      ],
      scoringGuide: [
        { score: 'Ensaio 1–3', description: 'Registre o tempo em segundos de cada um dos três ensaios.' },
        {
          score: 'Resultado',
          description: 'A média aritmética dos três tempos compõe o escore bruto do teste.',
        },
      ],
      scoringGuideNote: 'Tempos mais altos indicam maior dificuldade na locomoção funcional.',
    },
    step2: {
      body: 'O resultado bruto é a média aritmética dos três ensaios. A interpretação de triagem segue:',
      bullets: [
        'Menor que 10 segundos: desempenho funcional muito bom.',
        '10 a 13,4 segundos: desempenho funcional esperado — atenção clínica ao contexto.',
        '13,5 segundos ou mais: maior risco de quedas em idosos da comunidade.',
      ],
    },
  },
};

export const ALL_ASSESSMENT_INSTRUMENTS = [...QUESTIONNAIRE_INSTRUMENTS, TUG_INSTRUMENT] as const;

export const ALL_ASSESSMENT_INSTRUMENT_OPTIONS = ALL_ASSESSMENT_INSTRUMENTS.map((item) => ({
  value: item.code,
  label: item.name,
}));

export function getAssessmentInstrument(code: string): TutorialInstrument | undefined {
  if (code === 'tug') {
    return TUG_INSTRUMENT;
  }
  return getQuestionnaireInstrument(code);
}
