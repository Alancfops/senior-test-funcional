import { StyleSheet, Text, View } from 'react-native';

import { tokens } from '@/theme/tokens';

type Rule = {
  label: string;
  met: boolean;
};

type PasswordRequirementsProps = {
  password: string;
};

function buildRules(password: string): Rule[] {
  return [
    { label: 'Mínimo de 8 caracteres', met: password.length >= 8 },
    { label: 'Uma letra maiúscula', met: /[A-ZÀ-Ý]/.test(password) },
    { label: 'Uma letra minúscula', met: /[a-zà-ÿ]/.test(password) },
    { label: 'Um número', met: /\d/.test(password) },
    {
      label: 'Um caracter especial (@, #, %, &, $)',
      met: /[@#%&$]/.test(password),
    },
  ];
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const rules = buildRules(password);

  return (
    <View style={styles.wrap} accessibilityRole="text">
      {rules.map((rule) => (
        <View key={rule.label} style={styles.row}>
          <View style={[styles.bullet, rule.met && styles.bulletMet]}>
            {rule.met ? <Text style={styles.check}>✓</Text> : null}
          </View>
          <Text style={[styles.text, rule.met && styles.textMet]}>{rule.label}</Text>
        </View>
      ))}
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
