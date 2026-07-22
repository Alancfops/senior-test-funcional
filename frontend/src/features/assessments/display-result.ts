/**
 * Prévia de resultado — Fase A (UI mock).
 * Classificação oficial virá da API no finalize (Fase D).
 */
import type { QuestionnaireAnswers, QuestionnaireDefinition, DisplayResult } from '@/features/assessments/types';

function sumNumericAnswers(definition: QuestionnaireDefinition, answers: QuestionnaireAnswers) {
  return definition.items.reduce((total, item) => {
    if (item.config.kind !== 'numeric') {
      return total;
    }
    const value = answers[item.id];
    return total + (typeof value === 'number' ? value : 0);
  }, 0);
}

function classifyBerg(total: number): string {
  if (total <= 20) {
    return 'Risco gravíssimo de quedas, com possível necessidade de cadeira de rodas. Recomenda-se reavaliação frequente e plano de prevenção intensivo.';
  }
  if (total <= 40) {
    return 'Risco moderado a alto de quedas. Pode ser necessário auxílio para marcha (andador ou bengala) e supervisão nas transferências.';
  }
  return 'Baixo risco de quedas, sugerindo independência e segurança relativas para locomoção. Mantenha monitoramento longitudinal.';
}

function classifyKatz(answers: QuestionnaireAnswers): { stratum: number; text: string } {
  const dependentCount = Object.values(answers).filter((value) => value === 'dependente').length;
  const texts: Record<number, string> = {
    0: 'Independente em todas as atividades básicas de vida diária.',
    1: 'Dependente em uma atividade.',
    2: 'Dependente em duas atividades.',
    3: 'Dependente em três atividades.',
    4: 'Dependente em quatro atividades.',
    5: 'Dependente em cinco atividades.',
    6: 'Dependente em todas as atividades.',
  };
  return { stratum: dependentCount, text: texts[dependentCount] ?? texts[6] };
}

function classifyTinetti(total: number): string {
  if (total < 19) {
    return 'Alto risco de quedas. Equilíbrio e/ou marcha comprometidos — priorize intervenção e ambiente seguro.';
  }
  if (total <= 24) {
    return 'Risco moderado de quedas. Déficits detectáveis; acompanhar evolução e reforçar estratégias de prevenção.';
  }
  return 'Baixo risco de quedas. Desempenho funcional preservado na avaliação atual.';
}

const BRUCKI_CUTOFF: Record<string, number> = {
  analfabeto: 20,
  '1_4_anos': 25,
  '5_8_anos': 26.5,
  '9_11_anos': 28,
  mais_11_anos: 29,
};

function classifyMeem(total: number, schoolingBand?: string): string {
  const cutoff = schoolingBand ? BRUCKI_CUTOFF[schoolingBand] : undefined;
  if (cutoff === undefined) {
    return `Pontuação total ${total}/30. Confirme a escolaridade no cadastro para interpretação com corte Brucki (2003).`;
  }
  if (total < cutoff) {
    return `Pontuação abaixo do corte (${cutoff}) para a escolaridade registrada — achado compatível com déficit cognitivo na triagem. Não substitui diagnóstico clínico.`;
  }
  return `Pontuação igual ou acima do corte (${cutoff}) para a escolaridade registrada — desempenho dentro do esperado na triagem. Não substitui diagnóstico clínico.`;
}

export function buildDisplayResult(
  definition: QuestionnaireDefinition,
  answers: QuestionnaireAnswers,
  schoolingBand?: string,
): DisplayResult {
  switch (definition.code) {
    case 'berg': {
      const total = sumNumericAnswers(definition, answers);
      return {
        scoreLabel: 'Pontuação',
        scoreValue: String(total),
        maxScore: '56',
        classificationLabel: 'Interpretação',
        interpretation: classifyBerg(total),
      };
    }
    case 'katz': {
      const { stratum, text } = classifyKatz(answers);
      return {
        scoreLabel: 'Estrato Katz',
        scoreValue: String(stratum),
        maxScore: '6',
        classificationLabel: 'Interpretação',
        interpretation: text,
      };
    }
    case 'tinetti': {
      const total = sumNumericAnswers(definition, answers);
      return {
        scoreLabel: 'Pontuação',
        scoreValue: String(total),
        maxScore: '28',
        classificationLabel: 'Interpretação',
        interpretation: classifyTinetti(total),
      };
    }
    case 'meem': {
      const total = sumNumericAnswers(definition, answers);
      return {
        scoreLabel: 'Pontuação',
        scoreValue: String(total),
        maxScore: '30',
        classificationLabel: 'Interpretação',
        interpretation: classifyMeem(total, schoolingBand),
      };
    }
    default:
      return {
        scoreLabel: 'Resultado',
        scoreValue: '—',
        maxScore: '—',
        classificationLabel: 'Interpretação',
        interpretation: 'Instrumento não reconhecido.',
      };
  }
}

export function formatDurationMs(ms: number) {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function formatAssessmentDate(date: Date) {
  return date.toLocaleDateString('pt-BR');
}

/** Dados ilustrativos para gráfico RF012 — substituir por API. */
export const MOCK_EVOLUTION_POINTS = [
  { label: 'Out', value: 38 },
  { label: 'Nov', value: 42 },
  { label: 'Dez', value: 40 },
  { label: 'Jan', value: 44 },
  { label: 'Fev', value: 46 },
  { label: 'Mar', value: 48 },
];
