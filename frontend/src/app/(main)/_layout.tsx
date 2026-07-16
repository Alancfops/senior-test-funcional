import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="assessments" />
      <Stack.Screen name="patients/new" />
      <Stack.Screen name="patients/[id]" />
      <Stack.Screen name="patients/[id]/assessment/[assessmentId]" />
      <Stack.Screen name="system-info" />
    </Stack>
  );
}
