import { useLocalSearchParams } from 'expo-router';

import { PatientFormScreen } from '@/components/patients/PatientFormScreen';

/**
 * Edição de cadastro — reutiliza o layout Figma de Adicionar Paciente (RF004).
 * Entrada: lápis na coleta / perfil.
 */
export default function EditPatientScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <PatientFormScreen mode="edit" patientId={id} />;
}
