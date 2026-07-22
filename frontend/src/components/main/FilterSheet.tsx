import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { tokens } from '@/theme/tokens';

type FilterSheetProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  children: React.ReactNode;
};

export function FilterSheet({
  visible,
  title,
  onClose,
  onApply,
  onClear,
  children,
}: FilterSheetProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      accessibilityViewIsModal>
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar filtros"
          style={styles.backdrop}
          onPress={onClose}
        />

        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>

          <View style={styles.actions}>
            <View style={styles.actionButton}>
              <Button
                label="Limpar"
                variant="outline"
                onPress={onClear}
                accessibilityHint="Remove todos os filtros selecionados"
              />
            </View>
            <View style={styles.actionButton}>
              <Button
                label="Aplicar"
                onPress={onApply}
                accessibilityHint="Aplica os filtros na lista"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

type FilterOptionProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function FilterOption({ label, selected, onPress }: FilterOptionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        selected && styles.optionSelected,
        pressed && styles.optionPressed,
      ]}>
      <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{label}</Text>
    </Pressable>
  );
}

type FilterSectionProps = {
  title: string;
  children: React.ReactNode;
};

export function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.optionGrid}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  sheet: {
    backgroundColor: tokens.colors.surface,
    borderTopLeftRadius: tokens.radius.cardTop,
    borderTopRightRadius: tokens.radius.cardTop,
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.sm,
    paddingBottom: tokens.spacing.lg,
    maxHeight: '78%',
    gap: tokens.spacing.md,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.border,
    marginBottom: tokens.spacing.xs,
  },
  title: {
    ...tokens.typography.title,
    fontSize: 18,
    color: tokens.colors.text,
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    gap: tokens.spacing.lg,
    paddingBottom: tokens.spacing.sm,
  },
  section: {
    gap: tokens.spacing.sm,
  },
  sectionTitle: {
    ...tokens.typography.body,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.sm,
  },
  option: {
    minHeight: tokens.touchTargetMin,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.radius.full,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    backgroundColor: tokens.colors.pageBackground,
    justifyContent: 'center',
  },
  optionSelected: {
    borderColor: tokens.colors.primary,
    backgroundColor: 'rgba(54, 102, 224, 0.12)',
  },
  optionPressed: {
    opacity: 0.9,
  },
  optionLabel: {
    ...tokens.typography.body,
    color: tokens.colors.text,
  },
  optionLabelSelected: {
    color: tokens.colors.primary,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
