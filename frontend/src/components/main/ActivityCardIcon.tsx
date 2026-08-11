import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type ActivityCardIconProps = {
  gender?: string | null;
  color: string;
  size?: number;
};

/** Figma — silhueta no card de atividade/teste conforme sexo cadastrado do paciente. */
export function ActivityCardIcon({ gender, color, size = 26 }: ActivityCardIconProps) {
  switch (gender) {
    case 'feminino':
      return <MaterialCommunityIcons name="human-female" size={size} color={color} />;
    case 'masculino':
      return <Ionicons name="walk-outline" size={size} color={color} />;
    case 'outro':
    default:
      return <Ionicons name="person-outline" size={size} color={color} />;
  }
}
