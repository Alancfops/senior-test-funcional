import { ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { tokens } from '@/theme/tokens';

type SettingsMenuItemProps = {
  label: string;
  onPress: () => void;
  accessibilityHint?: string;
};

export function SettingsMenuItem({ label, onPress, accessibilityHint }: SettingsMenuItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <Text style={styles.label}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={tokens.colors.primary} />
    </Pressable>
  );
}

type SettingsSectionProps = {
  title: string;
  children: ReactNode;
};

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        {title}
      </Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: tokens.spacing.sm,
  },
  sectionTitle: {
    ...tokens.typography.body,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  sectionBody: {
    gap: tokens.spacing.sm,
  },
  row: {
    minHeight: tokens.touchTargetMin,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tokens.colors.pageBackground,
    borderRadius: tokens.radius.lg,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
  },
  label: {
    ...tokens.typography.body,
    color: tokens.colors.text,
    flex: 1,
  },
  pressed: {
    opacity: 0.85,
  },
});
