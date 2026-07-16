import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tokens } from '@/theme/tokens';

type AssessmentCollectHeaderProps = {
  fullName: string;
  age: number;
  screenTitle?: string;
  onBack: () => void;
  onEditPatient?: () => void;
};

/** Figma — header azul da coleta (Aplicar Teste / Resultado). */
export function AssessmentCollectHeader({
  fullName,
  age,
  screenTitle = 'Aplicar Teste',
  onBack,
  onEditPatient,
}: AssessmentCollectHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={onBack}
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
          <Ionicons name="arrow-back" size={24} color={tokens.colors.onPrimary} />
        </Pressable>
        <Text style={styles.screenTitle} accessibilityRole="header">
          {screenTitle}
        </Text>
        <View style={styles.iconButton} />
      </View>

      <View style={styles.profileRow}>
        <View style={styles.avatarRing}>
          <Image
            source={require('@/assets/images/brand/seniortest-logo-circle.png')}
            style={styles.avatar}
            contentFit="cover"
            accessibilityIgnoresInvertColors
          />
        </View>
        <View style={styles.identity}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.age}>{age} Anos</Text>
        </View>
        {onEditPatient ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Editar paciente"
            onPress={onEditPatient}
            style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}>
            <Ionicons name="pencil" size={18} color={tokens.colors.primary} />
          </Pressable>
        ) : (
          <View style={styles.editPlaceholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: tokens.colors.primary,
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.lg,
    borderBottomLeftRadius: tokens.radius.lg,
    borderBottomRightRadius: tokens.radius.lg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: tokens.touchTargetMin,
    marginBottom: tokens.spacing.md,
  },
  iconButton: {
    minWidth: tokens.touchTargetMin,
    minHeight: tokens.touchTargetMin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    flex: 1,
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.onPrimary,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  avatarRing: {
    width: 64,
    height: 64,
    borderRadius: tokens.radius.full,
    backgroundColor: 'rgba(255,255,255,0.35)',
    padding: 3,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: tokens.radius.full,
  },
  identity: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    color: tokens.colors.onPrimary,
  },
  age: {
    ...tokens.typography.subtitle,
    color: 'rgba(255,255,255,0.92)',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.onPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editPlaceholder: {
    width: 40,
    height: 40,
  },
});
