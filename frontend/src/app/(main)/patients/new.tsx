import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfilePhotoField } from '@/components/patients/ProfilePhotoField';
import { ButtonRow } from '@/components/ui/Button';
import { SelectField } from '@/components/ui/SelectField';
import { TextInput } from '@/components/ui/TextInput';
import { GENDER_OPTIONS, SCHOOLING_OPTIONS } from '@/features/patients/constants';
import { PatientFormValues, patientSchema } from '@/features/patients/schemas';
import { tokens } from '@/theme/tokens';

/** Figma — Adicionar Paciente (RF004). Cadastro mockado até API Fase A. */
export default function NewPatientScreen() {
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      fullName: '',
      age: '',
      gender: '',
      schoolingBand: '',
      phone: '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      // Mock — persistência local/API virá na Fase C (POST /patients).
      await new Promise((resolve) => setTimeout(resolve, 400));
      Alert.alert('Paciente cadastrado', `${values.fullName} foi registrado (demonstração).`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={() => router.back()}
            hitSlop={8}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <Ionicons name="arrow-back" size={24} color={tokens.colors.text} />
          </Pressable>
          <Text style={styles.headerTitle} accessibilityRole="header">
            Adicionar Paciente
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={styles.subtitle}>
            Preencha os dados do paciente para realizar o cadastro no aplicativo.
          </Text>

          <ProfilePhotoField />

          <View style={styles.form}>
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Digite o nome"
                  labelTone="neutral"
                  required
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.fullName?.message}
                  autoComplete="name"
                  returnKeyType="next"
                />
              )}
            />

            <Controller
              control={control}
              name="age"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Idade"
                  labelTone="neutral"
                  required
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.age?.message}
                  keyboardType="number-pad"
                  returnKeyType="next"
                />
              )}
            />

            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <SelectField
                  label="Sexo"
                  required
                  value={value}
                  placeholder="Selecione o sexo"
                  options={GENDER_OPTIONS}
                  onChange={onChange}
                  error={errors.gender?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="schoolingBand"
              render={({ field: { onChange, value } }) => (
                <SelectField
                  label="Escolaridade"
                  value={value}
                  placeholder="Selecione a escolaridade"
                  options={SCHOOLING_OPTIONS}
                  onChange={onChange}
                  error={errors.schoolingBand?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Telefone"
                  labelTone="neutral"
                  required
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.phone?.message}
                  keyboardType="phone-pad"
                  placeholder="(82) 9 9999-9999"
                  returnKeyType="done"
                />
              )}
            />
          </View>

          <ButtonRow
            backLabel="Voltar"
            actionLabel="Cadastrar"
            onBack={() => router.back()}
            onAction={onSubmit}
            loading={submitting}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: tokens.colors.border,
  },
  backButton: {
    minWidth: tokens.touchTargetMin,
    minHeight: tokens.touchTargetMin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.text,
    textAlign: 'center',
  },
  headerSpacer: {
    width: tokens.touchTargetMin,
  },
  pressed: {
    opacity: 0.85,
  },
  scrollContent: {
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xl,
    gap: tokens.spacing.lg,
  },
  subtitle: {
    ...tokens.typography.subtitle,
    color: tokens.colors.textMuted,
  },
  form: {
    gap: tokens.spacing.md,
  },
});
