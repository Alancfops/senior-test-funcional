import { ReactNode, useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthHeader } from '@/components/auth/AuthHeader';
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
  /** Formulário curto (login) — sem scroll quando couber na tela. */
  scrollable?: boolean;
};

export function AuthScreenLayout({
  title,
  subtitle,
  children,
  variant = 'branded',
  headerFlex = 2,
  bodyFlex = 3,
  scrollable = true,
}: AuthScreenLayoutProps) {
  const [keyboardInset, setKeyboardInset] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardInset(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardInset(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const bottomPad = tokens.spacing.xl + (Platform.OS === 'android' ? keyboardInset : 0);

  if (variant === 'plain') {
    return (
      <SafeAreaView style={styles.plainRoot} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[styles.plainScrollContent, { paddingBottom: bottomPad }]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
            showsVerticalScrollIndicator={false}>
            {title ? (
              <View style={styles.headerBlock}>
                <Text style={styles.plainTitle} accessibilityRole="header">
                  {title}
                </Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
              </View>
            ) : null}

            <View style={styles.form}>{children}</View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  const brandedContent = (
    <>
      {title ? (
        <View style={styles.headerBlock}>
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      ) : null}

      <View style={styles.form}>{children}</View>
    </>
  );

  return (
    <View style={styles.root}>
      <SafeAreaView style={[styles.headerArea, { flex: headerFlex }]} edges={['top']}>
        <AuthHeader />
      </SafeAreaView>

      <View style={[styles.body, { flex: bodyFlex }]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
          {scrollable ? (
            <ScrollView
              style={styles.flex}
              contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad }]}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
              showsVerticalScrollIndicator={false}>
              {brandedContent}
            </ScrollView>
          ) : (
            <View style={[styles.flex, styles.scrollContent]}>{brandedContent}</View>
          )}
        </KeyboardAvoidingView>
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
  flex: {
    flex: 1,
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
