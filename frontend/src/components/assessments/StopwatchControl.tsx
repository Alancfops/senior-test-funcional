import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatStopwatchMs } from '@/features/assessments/tug/constants';
import { tokens } from '@/theme/tokens';

type StopwatchControlProps = {
  recordedSeconds: number | null;
  onRecord: (seconds: number) => void;
};

/** Cronômetro TUG — Figma Parar / Iniciar. */
export function StopwatchControl({ recordedSeconds, onRecord }: StopwatchControlProps) {
  const [running, setRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startedAtRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (recordedSeconds !== null) {
      setElapsedMs(Math.round(recordedSeconds * 1000));
      setRunning(false);
    }
  }, [recordedSeconds]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  function clearTimer() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function handleStart() {
    clearTimer();
    startedAtRef.current = Date.now();
    setRunning(true);
    intervalRef.current = setInterval(() => {
      if (startedAtRef.current) {
        setElapsedMs(Date.now() - startedAtRef.current);
      }
    }, 100);
  }

  function handleStop() {
    clearTimer();
    setRunning(false);
    if (startedAtRef.current) {
      const seconds = (Date.now() - startedAtRef.current) / 1000;
      setElapsedMs(Math.round(seconds * 1000));
      onRecord(seconds);
    }
  }

  const displayMs = recordedSeconds !== null && !running ? Math.round(recordedSeconds * 1000) : elapsedMs;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Cronômetro:</Text>
      <Text style={styles.time} accessibilityLabel={`Tempo ${formatStopwatchMs(displayMs)}`}>
        {formatStopwatchMs(displayMs)}
      </Text>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Parar cronômetro"
          onPress={handleStop}
          disabled={!running}
          style={({ pressed }) => [
            styles.stopButton,
            !running && styles.buttonDisabled,
            pressed && running && styles.pressed,
          ]}>
          <Ionicons name="stop" size={16} color={tokens.colors.primary} />
          <Text style={styles.stopLabel}>Parar</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Iniciar cronômetro"
          onPress={handleStart}
          disabled={running}
          style={({ pressed }) => [
            styles.startButton,
            running && styles.buttonDisabled,
            pressed && !running && styles.pressed,
          ]}>
          <Ionicons name="play" size={16} color={tokens.colors.onPrimary} />
          <Text style={styles.startLabel}>Iniciar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    gap: tokens.spacing.sm,
    shadowColor: tokens.colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  time: {
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 42,
    color: tokens.colors.text,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  actions: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginTop: tokens.spacing.xs,
  },
  stopButton: {
    flex: 1,
    minHeight: tokens.touchTargetMin,
    borderRadius: tokens.radius.pill,
    backgroundColor: 'rgba(54, 102, 224, 0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  startButton: {
    flex: 1,
    minHeight: tokens.touchTargetMin,
    borderRadius: tokens.radius.pill,
    backgroundColor: tokens.colors.buttonPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  stopLabel: {
    ...tokens.typography.buttonCompact,
    color: tokens.colors.primary,
  },
  startLabel: {
    ...tokens.typography.buttonCompact,
    color: tokens.colors.onPrimary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
});
