export type QuestionnaireInstrumentCode = 'katz' | 'berg' | 'tinetti' | 'meem';

export type TutorialStep = {
  /** Parágrafo introdutório ou texto antes dos bullets. */
  body: string;
  /** Bullets opcionais (passo 2 — classificação / interpretação). */
  bullets?: readonly string[];
};

export type QuestionnaireInstrument = {
  code: QuestionnaireInstrumentCode;
  name: string;
  tutorial: {
    step1: TutorialStep;
    step2: TutorialStep;
  };
};

/** Instrumentos de questionário (RF007/RF009). TUG excluído — coleta por tempo (RF010). */
export const QUESTIONNAIRE_INSTRUMENTS: readonly QuestionnaireInstrument[] = [
  {
    code: 'berg',
    name: 'Escala de Equilíbrio de Berg',
    tutorial: {
      step1: {
        body:
          'A Escala de Equilíbrio de Berg (EEB) é um teste clínico padrão-ouro na fisioterapia para avaliar o equilíbrio estático e dinâmico, além do risco de quedas. O teste é composto por 14 tarefas do cotidiano (como sentar, levantar e alcançar objetos), com pontuações de 0 a 4 para cada uma.',
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
          'O Índice de Katz avalia a independência do paciente em Atividades Básicas de Vida Diária (ABVD). São seis domínios: banho, vestir-se, uso do vaso sanitário, transferência, continência e alimentação. Para cada item, registra-se se o paciente é Independente, necessita de Assistência ou é Dependente.',
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
          'O Teste de Tinetti (Performance-Oriented Mobility Assessment — POMA) avalia equilíbrio e marcha em ambiente supervisionado. Compõe-se de duas partes: equilíbrio (9 itens, até 16 pontos) e marcha (7 itens, até 12 pontos). Cada item é pontuado conforme o desempenho observado, de 0 até 1 ou 2 pontos.',
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
          'O Mini Exame do Estado Mental (MEEM) é um instrumento de triagem cognitiva que avalia orientação temporal e espacial, registro, atenção e cálculo, memória de evocação e linguagem. A pontuação total máxima é 30 pontos. Confirme a escolaridade do paciente no início da sessão — ela define o corte interpretativo.',
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
