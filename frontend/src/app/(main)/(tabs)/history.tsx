import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { tokens } from '@/theme/tokens';

/** Placeholder — histórico de avaliações. */
export default function HistoryTabScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.title} accessibilityRole="header">
          Histórico
        </Text>
        <Text style={styles.subtitle}>
          O histórico consolidado de avaliações será exibido aqui quando a API estiver disponível.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.colors.pageBackground,
  },
  content: {
    flex: 1,
    padding: tokens.spacing.lg,
    gap: tokens.spacing.md,
  },
  title: {
    ...tokens.typography.title,
    color: tokens.colors.text,
  },
  subtitle: {
    ...tokens.typography.body,
    color: tokens.colors.textMuted,
  },
});
