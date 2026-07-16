export type MockAssessment = {
  id: string;
  instrumentCode: string;
  instrumentName: string;
  /** Ex.: 21/03/2025 */
  displayDate: string;
  /** Ex.: Ontem — opcional no card de detalhe */
  relativeWhen?: string;
};

export type MockPatient = {
  id: string;
  fullName: string;
  age: number;
  gender: 'masculino' | 'feminino' | 'outro';
  phone: string;
  /** Faixa Brucki — MEEM (RF004 / assess.md). */
  schoolingBand?: string;
  assessments: MockAssessment[];
};

/** RF006 — dados mock Fase A (substituir por GET /patients/:id na Fase D). */
export const MOCK_PATIENTS: MockPatient[] = [
  {
    id: 'maria-de-luordes',
    fullName: 'Maria de Luordes',
    age: 77,
    gender: 'feminino',
    phone: '(82) 9 8765-4321',
    schoolingBand: '1_4_anos',
    assessments: [],
  },
  {
    id: 'albertino-silva',
    fullName: 'Albertino Silva',
    age: 82,
    gender: 'masculino',
    phone: '(82) 9 9123-4567',
    schoolingBand: '5_8_anos',
    assessments: [
      {
        id: 'berg-2025-03-21',
        instrumentCode: 'berg',
        instrumentName: 'Escala de Equilíbrio de Berg',
        displayDate: '21/03/2025',
      },
      {
        id: 'tinetti-2025-12-15',
        instrumentCode: 'tinetti',
        instrumentName: 'Escala de Tinetti (ou POMA)',
        displayDate: '15/12/2025',
        relativeWhen: 'Ontem',
      },
    ],
  },
];

export function getMockPatientById(id: string): MockPatient | undefined {
  return MOCK_PATIENTS.find((patient) => patient.id === id);
}

export function getMockAssessment(patientId: string, assessmentId: string) {
  const patient = getMockPatientById(patientId);
  if (!patient) {
    return undefined;
  }
  const assessment = patient.assessments.find((item) => item.id === assessmentId);
  if (!assessment) {
    return undefined;
  }
  return { patient, assessment };
}

/** Atividades recentes da home → perfil mock. */
export const ACTIVITY_PATIENT_ID: Record<string, string> = {
  'Albertino Silva': 'albertino-silva',
  'Maria de Luordes': 'maria-de-luordes',
};
