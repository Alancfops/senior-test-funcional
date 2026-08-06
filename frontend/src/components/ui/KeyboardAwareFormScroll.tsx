import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput as RNTextInput,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { tokens } from '@/theme/tokens';

type KeyboardFormContextValue = {
  /** Chame no onFocus do campo para garantir que ele fique acima do teclado. */
  ensureFocusedVisible: () => void;
};

const KeyboardFormContext = createContext<KeyboardFormContextValue>({
  ensureFocusedVisible: () => undefined,
});

export function useKeyboardFormScroll() {
  return useContext(KeyboardFormContext);
}

type KeyboardAwareFormScrollProps = {
  children: ReactNode;
  header?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

/**
 * Formulário com teclado: padding + scroll do campo focado para cima do teclado
 * (ex.: Contato no cadastro de paciente).
 */
export function KeyboardAwareFormScroll({
  children,
  header,
  contentContainerStyle,
  style,
}: KeyboardAwareFormScrollProps) {
  const scrollRef = useRef<ScrollView>(null);
  const scrollOffsetRef = useRef(0);
  const keyboardHeightRef = useRef(0);
  const [keyboardInset, setKeyboardInset] = useState(0);

  const ensureFocusedVisible = useCallback(() => {
    const keyboardHeight = keyboardHeightRef.current;
    if (keyboardHeight <= 0) {
      return;
    }

    const run = () => {
      const focused =
        typeof RNTextInput.State?.currentlyFocusedInput === 'function'
          ? RNTextInput.State.currentlyFocusedInput()
          : null;

      if (!focused || typeof focused.measureInWindow !== 'function') {
        scrollRef.current?.scrollToEnd({ animated: true });
        return;
      }

      focused.measureInWindow((_x: number, y: number, _w: number, height: number) => {
        const windowHeight = Dimensions.get('window').height;
        const keyboardTop = windowHeight - keyboardHeight;
        const fieldBottom = y + height;
        // Folga maior: campo + label precisam ficar acima do teclado (não só a metade).
        const overlap = fieldBottom + 120 - keyboardTop;

        if (overlap > 0) {
          scrollRef.current?.scrollTo({
            y: Math.max(0, scrollOffsetRef.current + overlap),
            animated: true,
          });
        }
      });
    };

    requestAnimationFrame(() => {
      setTimeout(run, Platform.OS === 'ios' ? 50 : 100);
    });
  }, []);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (event) => {
      const height = event.endCoordinates.height;
      keyboardHeightRef.current = height;
      setKeyboardInset(height);
      ensureFocusedVisible();
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      keyboardHeightRef.current = 0;
      setKeyboardInset(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [ensureFocusedVisible]);

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
  }

  const bottomPadding =
    tokens.spacing.xl +
    (keyboardInset > 0 ? keyboardInset + tokens.spacing.xl * 3 : tokens.spacing.xl);

  return (
    <KeyboardFormContext.Provider value={{ ensureFocusedVisible }}>
      <KeyboardAvoidingView
        style={[styles.flex, style]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        {header}
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: bottomPadding },
            contentContainerStyle,
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}>
          {children}
          {/* Folga extra no fim para o último campo (contato) subir de verdade. */}
          <View style={{ height: keyboardInset > 0 ? tokens.spacing.xl : 0 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </KeyboardFormContext.Provider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});
