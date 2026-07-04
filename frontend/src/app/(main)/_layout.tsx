import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: 'Senior Teste Funcional',
        headerBackVisible: false,
      }}
    />
  );
}
