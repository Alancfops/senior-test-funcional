import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthHeader } from '@/components/auth/AuthHeader';
import { KeyboardAwareScroll } from '@/components/ui/KeyboardAwareFormScroll';
import { tokens } from '@/theme/tokens';

type AuthScreenLayoutProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  /** Login/esqueci senha — header azul + logo. Cadastro — tela branca inteira (Figma). */
  variant?: 'branded' | 'plain';
  /** Proporção do header azul (padrão 2 ≈ 40%). */
  headerFlex?: number;
  /** Proporção da área branca (padrão 3 ≈ 60%). */
  bodyFlex?: number;
};

export function AuthScreenLayout({
  title,
  subtitle,
  children,
  variant = 'branded',
  headerFlex = 2,
  bodyFlex = 3,
}: AuthScreenLayoutProps) {
  const headerBlock = title ? (
    <View style={styles.headerBlock}>
      <Text
        style={variant === 'plain' ? styles.plainTitle : styles.title}
        accessibilityRole="header">
        {title}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  ) : null;

  if (variant === 'plain') {
    return (
      <SafeAreaView style={styles.plainRoot} edges={['top', 'bottom']}>
        <KeyboardAwareScroll contentContainerStyle={styles.plainScrollContent}>
          {headerBlock}
          <View style={styles.form}>{children}</View>
        </KeyboardAwareScroll>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={[styles.headerArea, { flex: headerFlex }]} edges={['top']}>
        <AuthHeader />
      </SafeAreaView>

      <View style={[styles.body, { flex: bodyFlex }]}>
        <KeyboardAwareScroll contentContainerStyle={styles.scrollContent}>
          {headerBlock}
          <View style={styles.form}>{children}</View>
        </KeyboardAwareScroll>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  plainRoot: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
  },
  plainScrollContent: {
    flexGrow: 1,
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.lg,
  },
  plainTitle: {
    ...tokens.typography.title,
    color: tokens.colors.primary,
  },
  root: {
    flex: 1,
    backgroundColor: tokens.colors.headerGradientEnd,
  },
  headerArea: {
    backgroundColor: tokens.colors.headerGradientStart,
  },
  body: {
    backgroundColor: tokens.colors.surface,
    borderTopLeftRadius: tokens.radius.cardTop,
    borderTopRightRadius: tokens.radius.cardTop,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.lg,
  },
  headerBlock: {
    marginBottom: tokens.spacing.lg,
    gap: tokens.spacing.xs,
  },
  title: {
    ...tokens.typography.title,
    color: tokens.colors.primary,
  },
  subtitle: {
    ...tokens.typography.subtitle,
    color: tokens.colors.textMuted,
  },
  form: {
    gap: tokens.spacing.md,
  },
});
