import { ReactNode } from 'react';
import { Platform } from 'react-native';
import { KeyboardProvider as NativeKeyboardProvider } from 'react-native-keyboard-controller';

type AppKeyboardProviderProps = {
  children: ReactNode;
};

/**
 * Envolve o app inteiro — exigido pelo react-native-keyboard-controller.
 * Na web usa pass-through (a lib faz stub; evita edge cases de native view).
 */
export function AppKeyboardProvider({ children }: AppKeyboardProviderProps) {
  if (Platform.OS === 'web') {
    return <>{children}</>;
  }

  return <NativeKeyboardProvider preload={false}>{children}</NativeKeyboardProvider>;
}
