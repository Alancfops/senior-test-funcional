import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfilePhotoField, PatientAvatarSelection } from '@/components/patients/ProfilePhotoField';
import { ButtonRow } from '@/components/ui/Button';
import { SelectField } from '@/components/ui/SelectField';
import { TextInput } from '@/components/ui/TextInput';
import { createPatientRequest } from '@/features/patients/api';
import { GENDER_OPTIONS, SCHOOLING_OPTIONS } from '@/features/patients/constants';
import { PatientFormValues, parsePatientAge, patientSchema } from '@/features/patients/schemas';
import { ApiError } from '@/lib/api/client';
import {
  BRAZIL_MOBILE_PHONE_MASK_MAX_LENGTH,
  formatBrazilMobilePhone,
} from '@/lib/format/brazil-mobile-phone';
import { tokens } from '@/theme/tokens';

/** Figma — Adicionar Paciente (RF004). */
export default function NewPatientScreen() {
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<PatientAvatarSelection | null>(null);

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
    setFormError(null);
    setSubmitting(true);
    try {
      await createPatientRequest({
        fullName: values.fullName.trim(),
        age: parsePatientAge(values.age),
        gender: values.gender,
        contact: values.phone.trim(),
        schoolingBand: values.schoolingBand,
        ...(avatar
          ? {
              avatarImage: {
                mimeType: avatar.mimeType,
                base64: avatar.base64,
              },
            }
          : {}),
      });
      router.back();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.statusCode === 401) {
          setFormError('Sessão expirada. Saia e faça login novamente.');
        } else {
          setFormError(error.message);
        }
      } else {
        setFormError('Não foi possível cadastrar o paciente. Tente novamente.');
      }
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

          <ProfilePhotoField value={avatar} onChange={setAvatar} />

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
                  required
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
                  onChangeText={(text) => onChange(formatBrazilMobilePhone(text))}
                  onBlur={onBlur}
                  error={errors.phone?.message}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                  placeholder="(82) 9 9999-9999"
                  maxLength={BRAZIL_MOBILE_PHONE_MASK_MAX_LENGTH}
                  returnKeyType="done"
                />
              )}
            />
          </View>

          {formError ? (
            <Text style={styles.formError} accessibilityRole="alert" accessibilityLiveRegion="polite">
              {formError}
            </Text>
          ) : null}

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
  formError: {
    ...tokens.typography.caption,
    color: tokens.colors.error,
  },
});
