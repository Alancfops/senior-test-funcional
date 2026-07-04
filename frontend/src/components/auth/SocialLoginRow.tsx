import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppleIcon, FacebookIcon, GoogleIcon } from '@/components/brand/SocialBrandIcons';
import { tokens } from '@/theme/tokens';

const providers = [
  { id: 'google', label: 'Continuar com Google', Icon: GoogleIcon },
  { id: 'facebook', label: 'Continuar com Facebook', Icon: FacebookIcon },
  { id: 'apple', label: 'Continuar com Apple', Icon: AppleIcon },
];

/** Visual do Figma — login social ainda não previsto nos RFs; mantido como placeholder acessível. */
export function SocialLoginRow() {
  function handlePress(label: string) {
    Alert.alert('Em breve', `${label} estará disponível em uma versão futura.`);
  }

  return (
    <View style={styles.wrapper} accessibilityRole="none">
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerLabel}>ou</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.row}>
        {providers.map(({ id, label, Icon }) => (
          <Pressable
            key={id}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityHint="Recurso em breve"
            onPress={() => handlePress(label)}
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
            <Icon size={26} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: tokens.spacing.md,
    marginTop: tokens.spacing.sm,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: tokens.colors.border,
  },
  dividerLabel: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
    textTransform: 'lowercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: tokens.spacing.lg,
  },
  iconButton: {
    width: tokens.touchTargetMin,
    height: tokens.touchTargetMin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
