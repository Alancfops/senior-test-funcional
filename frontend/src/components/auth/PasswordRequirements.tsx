import { StyleSheet, Text, View } from 'react-native';

import { passwordRules } from '@/features/auth/password-rules';
import { tokens } from '@/theme/tokens';

type PasswordRequirementsProps = {
  password: string;
};

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  return (
    <View style={styles.wrap} accessibilityRole="text">
      {passwordRules.map((rule) => {
        const met = rule.test(password);
        return (
          <View key={rule.label} style={styles.row}>
            <View style={[styles.bullet, met && styles.bulletMet]}>
              {met ? <Text style={styles.check}>✓</Text> : null}
            </View>
            <Text style={[styles.text, met && styles.textMet]}>{rule.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  bullet: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulletMet: {
    backgroundColor: tokens.colors.checkOk,
    borderColor: tokens.colors.checkOk,
  },
  check: {
    color: tokens.colors.onPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  text: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
    flex: 1,
  },
  textMet: {
    color: tokens.colors.primary,
  },
});
