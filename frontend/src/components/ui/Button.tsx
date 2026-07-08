import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { tokens } from '@/theme/tokens';

type ButtonProps = PressableProps & {
  label: string;
  loading?: boolean;
  variant?: 'primary' | 'outline' | 'outlinePrimary';
  fullWidth?: boolean;
  compactLabel?: boolean;
  accessibilityHint?: string;
};

export function Button({
  label,
  loading = false,
  variant = 'primary',
  fullWidth = true,
  compactLabel = false,
  disabled,
  style,
  accessibilityHint,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        variant === 'primary' ? styles.primary : variant === 'outlinePrimary' ? styles.outlinePrimary : styles.outline,
        pressed && variant === 'primary' && styles.primaryPressed,
        isDisabled && styles.disabled,
        style as ViewStyle,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? tokens.colors.onPrimary : tokens.colors.buttonPrimary}
        />
      ) : (
        <Text
          style={[
            compactLabel ? styles.compactLabel : styles.label,
            variant === 'outline' && (compactLabel ? styles.compactOutlineLabel : styles.outlineLabel),
            variant === 'outlinePrimary' &&
              (compactLabel ? styles.compactOutlinePrimaryLabel : styles.outlinePrimaryLabel),
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.72}
          ellipsizeMode="clip">
          {label}
        </Text>
      )}
    </Pressable>
  );
}

type ButtonRowProps = {
  backLabel?: string;
  actionLabel: string;
  onBack: () => void;
  onAction: () => void;
  loading?: boolean;
  actionDisabled?: boolean;
  /** Botão principal mais largo (ex.: "Criar Nova Senha"). */
  wideAction?: boolean;
};

export function ButtonRow({
  backLabel = 'Voltar',
  actionLabel,
  onBack,
  onAction,
  loading,
  actionDisabled,
  wideAction = false,
}: ButtonRowProps) {
  return (
    <View style={styles.row}>
      <Button
        label={backLabel}
        variant="outlinePrimary"
        fullWidth={false}
        onPress={onBack}
        style={wideAction ? styles.backNarrow : styles.half}
        compactLabel
      />
      <Button
        label={actionLabel}
        fullWidth={false}
        onPress={onAction}
        loading={loading}
        disabled={actionDisabled}
        style={wideAction ? styles.actionWide : styles.half}
        compactLabel
      />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: tokens.buttonHeight,
    height: tokens.buttonHeight,
    borderRadius: tokens.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: 9,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  primary: {
    backgroundColor: tokens.colors.buttonPrimary,
  },
  primaryPressed: {
    backgroundColor: tokens.colors.buttonPrimaryPressed,
  },
  outline: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  outlinePrimary: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.primary,
  },
  disabled: {
    opacity: 0.55,
  },
  label: {
    ...tokens.typography.button,
    color: tokens.colors.onPrimary,
    textAlign: 'center',
  },
  compactLabel: {
    ...tokens.typography.buttonCompact,
    color: tokens.colors.onPrimary,
    textAlign: 'center',
  },
  outlineLabel: {
    color: tokens.colors.text,
  },
  compactOutlineLabel: {
    ...tokens.typography.buttonCompact,
    color: tokens.colors.text,
    textAlign: 'center',
  },
  outlinePrimaryLabel: {
    color: tokens.colors.primary,
  },
  compactOutlinePrimaryLabel: {
    ...tokens.typography.buttonCompact,
    color: tokens.colors.primary,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  half: {
    flex: 1,
    minWidth: 0,
  },
  backNarrow: {
    flex: 0.34,
    minWidth: 0,
  },
  actionWide: {
    flex: 0.66,
    minWidth: 0,
  },
});
