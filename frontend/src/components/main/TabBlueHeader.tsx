import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tokens } from '@/theme/tokens';

type TabBlueHeaderProps = {
  title: string;
  onBack?: () => void;
  children?: ReactNode;
};

/** Header azul — Figma Lista de Pacientes / abas secundárias. */
export function TabBlueHeader({ title, onBack, children }: TabBlueHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={onBack}
            hitSlop={8}
            style={({ pressed }) => [styles.iconSlot, pressed && styles.pressed]}>
            <Ionicons name="arrow-back" size={24} color={tokens.colors.onPrimary} />
          </Pressable>
        ) : (
          <View style={styles.iconSlot} />
        )}
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        <View style={styles.iconSlot} />
      </View>
      {children ? <View style={styles.slot}>{children}</View> : null}
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
    marginBottom: tokens.spacing.sm,
  },
  iconSlot: {
    minWidth: tokens.touchTargetMin,
    minHeight: tokens.touchTargetMin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.onPrimary,
    textAlign: 'center',
  },
  slot: {
    marginTop: tokens.spacing.xs,
  },
  pressed: {
    opacity: 0.85,
  },
});
