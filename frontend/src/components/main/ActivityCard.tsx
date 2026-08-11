import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ActivityCardIcon } from '@/components/main/ActivityCardIcon';
import { tokens } from '@/theme/tokens';

export type ActivityTone = 'primary' | 'secondary';

type ActivityCardProps = {
  patientName: string;
  description: string;
  when: string;
  /** Sexo cadastrado do paciente — define silhueta no ícone. */
  patientGender?: string | null;
  /** Revezamento Figma: ímpar = principal (#3666E0), par = secundária (#7CC5B4). */
  tone?: ActivityTone;
  onPress?: () => void;
};

const toneStyles: Record<ActivityTone, { bg: string; icon: string }> = {
  primary: {
    bg: tokens.colors.activityPrimary,
    icon: tokens.colors.onPrimary,
  },
  secondary: {
    bg: tokens.colors.activitySecondary,
    icon: tokens.colors.onPrimary,
  },
};

export function ActivityCard({
  patientName,
  description,
  when,
  patientGender,
  tone = 'primary',
  onPress,
}: ActivityCardProps) {
  const palette = toneStyles[tone];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${patientName}. ${description}. ${when}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={[styles.iconWrap, { backgroundColor: palette.bg }]}>
        <ActivityCardIcon gender={patientGender} color={palette.icon} />
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{patientName}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.trailing}>
        <Text style={styles.when}>{when}</Text>
        <Ionicons name="chevron-forward" size={18} color={tokens.colors.textMuted} />
      </View>
    </Pressable>
  );
}

/** Índice 0-based → principal, secundária, principal… */
export function activityToneForIndex(index: number): ActivityTone {
  return index % 2 === 0 ? 'primary' : 'secondary';
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  pressed: {
    opacity: 0.92,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    fontWeight: '600',
  },
  description: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
  },
  trailing: {
    alignItems: 'flex-end',
    gap: 4,
  },
  when: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
  },
});
