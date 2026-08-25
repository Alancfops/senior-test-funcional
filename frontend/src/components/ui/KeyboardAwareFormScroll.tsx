import { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { tokens } from '@/theme/tokens';

/** Espaço entre o campo focado e o topo do teclado. */
const KEYBOARD_BOTTOM_OFFSET = 24;

type ScrollProps = {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

function FormScroll({ children, contentContainerStyle, style }: ScrollProps) {
  return (
    <KeyboardAwareScrollView
      style={[styles.flex, style]}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      bottomOffset={KEYBOARD_BOTTOM_OFFSET}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}>
      {children}
    </KeyboardAwareScrollView>
  );
}

type KeyboardAwareFormScrollProps = ScrollProps & {
  header?: ReactNode;
};

/** Formulário com scroll sincronizado ao teclado (nativo, iOS + Android). */
export function KeyboardAwareFormScroll({
  children,
  header,
  contentContainerStyle,
  style,
}: KeyboardAwareFormScrollProps) {
  return (
    <View style={styles.flex}>
      {header}
      <FormScroll contentContainerStyle={contentContainerStyle} style={style}>
        {children}
      </FormScroll>
    </View>
  );
}

/** Scroll com teclado — telas auth e formulários curtos. */
export function KeyboardAwareScroll(props: ScrollProps) {
  return <FormScroll {...props} />;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: tokens.spacing.xl,
  },
});
