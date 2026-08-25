import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProfilePhotoField, PatientAvatarSelection } from '@/components/patients/ProfilePhotoField';
import { ButtonRow } from '@/components/ui/Button';
import { KeyboardAwareFormScroll } from '@/components/ui/KeyboardAwareFormScroll';
import { SelectField } from '@/components/ui/SelectField';
import { TextInput } from '@/components/ui/TextInput';
import {
  createPatientRequest,
  getPatientByIdRequest,
  updatePatientRequest,
} from '@/features/patients/api';
import { resolvePatientAvatarUrl } from '@/features/patients/avatar-url';
import { GENDER_OPTIONS, SCHOOLING_OPTIONS } from '@/features/patients/constants';
import { PatientFormValues, parsePatientAge, patientSchema } from '@/features/patients/schemas';
import { ApiError } from '@/lib/api/client';
import {
  BRAZIL_MOBILE_PHONE_MASK_MAX_LENGTH,
  formatBrazilMobilePhone,
} from '@/lib/format/brazil-mobile-phone';
import { tokens } from '@/theme/tokens';

type PatientFormScreenProps = {
  mode: 'create' | 'edit';
  patientId?: string;
};

type PatientFormBodyProps = {
  isEdit: boolean;
  control: ReturnType<typeof useForm<PatientFormValues>>['control'];
  errors: ReturnType<typeof useForm<PatientFormValues>>['formState']['errors'];
  avatar: PatientAvatarSelection | null;
  setAvatar: (value: PatientAvatarSelection | null) => void;
  existingAvatarUrl: string | null;
  formError: string | null;
  submitting: boolean;
  onSubmit: () => void;
};

function PatientFormBody({
  isEdit,
  control,
  errors,
  avatar,
  setAvatar,
  existingAvatarUrl,
  formError,
  submitting,
  onSubmit,
}: PatientFormBodyProps) {
  return (
    <>
      <Text style={styles.subtitle}>
        {isEdit
          ? 'Atualize os dados do paciente e salve as alterações.'
          : 'Preencha os dados do paciente para realizar o cadastro no aplicativo.'}
      </Text>

      <ProfilePhotoField
        value={avatar}
        onChange={setAvatar}
        existingUri={!avatar ? existingAvatarUrl : null}
      />

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
              label="Contato"
              labelTone="neutral"
              required
              value={value}
              onChangeText={(text) =>
                onChange(text.includes('@') ? text.replace(/\s/g, '') : formatBrazilMobilePhone(text))
              }
              onBlur={onBlur}
              error={errors.phone?.message}
              keyboardType={value.includes('@') ? 'email-address' : 'phone-pad'}
              autoComplete={value.includes('@') ? 'email' : 'tel'}
              textContentType={value.includes('@') ? 'emailAddress' : 'telephoneNumber'}
              autoCapitalize="none"
              placeholder="E-mail ou (82) 9 9999-9999"
              maxLength={value.includes('@') ? 254 : BRAZIL_MOBILE_PHONE_MASK_MAX_LENGTH}
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
        actionLabel={isEdit ? 'Salvar' : 'Cadastrar'}
        onBack={() => router.back()}
        onAction={onSubmit}
        loading={submitting}
      />
    </>
  );
}

/**
 * Figma — Adicionar Paciente (RF004), reutilizado para editar cadastro.
 * Mesmo layout; título/ação e endpoint mudam conforme o modo.
 */
export function PatientFormScreen({ mode, patientId }: PatientFormScreenProps) {
  const isEdit = mode === 'edit';
  const [submitting, setSubmitting] = useState(false);
  const [loadingPatient, setLoadingPatient] = useState(isEdit);
  const [formError, setFormError] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<PatientAvatarSelection | null>(null);
  const [existingAvatarUrl, setExistingAvatarUrl] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
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

  useEffect(() => {
    if (!isEdit || !patientId) {
      return;
    }

    let cancelled = false;

    async function load() {
      setLoadingPatient(true);
      setFormError(null);
      try {
        const patient = await getPatientByIdRequest(patientId);
        if (cancelled) {
          return;
        }
        reset({
          fullName: patient.fullName,
          age: String(patient.age),
          gender: patient.gender,
          schoolingBand: patient.schoolingBand ?? '',
          phone: patient.contact,
        });
        setExistingAvatarUrl(resolvePatientAvatarUrl(patient.avatarUrl));
      } catch (error) {
        if (cancelled) {
          return;
        }
        if (error instanceof ApiError) {
          setFormError(error.message);
        } else {
          setFormError('Não foi possível carregar o paciente.');
        }
      } finally {
        if (!cancelled) {
          setLoadingPatient(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [isEdit, patientId, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setSubmitting(true);
    try {
      const payload = {
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
      };

      if (isEdit && patientId) {
        await updatePatientRequest(patientId, payload);
      } else {
        await createPatientRequest(payload);
      }
      router.back();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.statusCode === 401) {
          setFormError('Sessão expirada. Saia e faça login novamente.');
        } else {
          setFormError(error.message);
        }
      } else {
        setFormError(
          isEdit
            ? 'Não foi possível salvar as alterações. Tente novamente.'
            : 'Não foi possível cadastrar o paciente. Tente novamente.',
        );
      }
    } finally {
      setSubmitting(false);
    }
  });

  if (loadingPatient) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.centered}>
          <ActivityIndicator color={tokens.colors.primary} accessibilityLabel="Carregando paciente" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAwareFormScroll
        header={
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
              {isEdit ? 'Editar Paciente' : 'Adicionar Paciente'}
            </Text>
            <View style={styles.headerSpacer} />
          </View>
        }
        contentContainerStyle={styles.scrollContent}>
        <PatientFormBody
          isEdit={isEdit}
          control={control}
          errors={errors}
          avatar={avatar}
          setAvatar={setAvatar}
          existingAvatarUrl={existingAvatarUrl}
          formError={formError}
          submitting={submitting}
          onSubmit={onSubmit}
        />
      </KeyboardAwareFormScroll>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
