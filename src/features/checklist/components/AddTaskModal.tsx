import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon } from '@/design-system/primitives/Icon';
import { Text } from '@/design-system/primitives/Text';
import { TextInput } from '@/design-system/components/forms/TextInput';
import { Button } from '@/design-system/components/actions/Button';
import { colors, radii, shadows, spacing } from '@/design-system/tokens';
import { TaskCategory, TaskPriority } from '../types/task.types';
import { CreateTaskPayload } from '../services/checklist.service';

const CATEGORIES: { id: TaskCategory; label: string; icon: string; color: string }[] = [
  { id: 'admin', label: 'Admin', icon: 'FileText', color: colors.blue },
  { id: 'finance', label: 'Finance', icon: 'CreditCard', color: colors.gold },
  { id: 'housing', label: 'Logement', icon: 'Home', color: colors.success },
  { id: 'health', label: 'Santé', icon: 'Heart', color: colors.danger },
  { id: 'practical', label: 'Pratique', icon: 'Smartphone', color: colors.warning },
];

const PRIORITIES: { value: TaskPriority; label: string; color: string; bg: string }[] = [
  { value: 1, label: 'Urgent', color: colors.danger, bg: '#FEF2F2' },
  { value: 2, label: 'Moyen', color: colors.warning, bg: '#FFFBEB' },
  { value: 3, label: 'Faible', color: '#9CA3AF', bg: '#F3F4F6' },
];

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTaskPayload) => void;
  isLoading?: boolean;
}

export function AddTaskModal({ visible, onClose, onSubmit, isLoading = false }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('admin');
  const [priority, setPriority] = useState<TaskPriority>(2);

  const canSubmit = title.trim().length > 0 && !isLoading;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ title: title.trim(), description: description.trim() || undefined, category, priority });
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('admin');
    setPriority(2);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text variant="heading3" style={styles.headerTitle}>Nouvelle tâche</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Icon name="X" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}
          >
            {/* Title */}
            <View style={styles.field}>
              <Text variant="label" style={styles.fieldLabel}>TITRE *</Text>
              <TextInput
                placeholder="Ex: Demander mon visa..."
                value={title}
                onChangeText={setTitle}
                autoFocus
              />
            </View>

            {/* Description */}
            <View style={styles.field}>
              <Text variant="label" style={styles.fieldLabel}>DESCRIPTION (optionnel)</Text>
              <TextInput
                placeholder="Détails supplémentaires..."
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>

            {/* Category */}
            <View style={styles.field}>
              <Text variant="label" style={styles.fieldLabel}>CATÉGORIE</Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setCategory(cat.id)}
                      activeOpacity={0.7}
                      style={[
                        styles.categoryChip,
                        isSelected && { backgroundColor: `${cat.color}15`, borderColor: cat.color },
                      ]}
                    >
                      <Icon name={cat.icon} size={14} color={isSelected ? cat.color : '#9CA3AF'} />
                      <Text
                        variant="label"
                        style={[styles.categoryChipLabel, isSelected && { color: cat.color }]}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Priority */}
            <View style={styles.field}>
              <Text variant="label" style={styles.fieldLabel}>PRIORITÉ</Text>
              <View style={styles.priorityRow}>
                {PRIORITIES.map((p) => {
                  const isSelected = priority === p.value;
                  return (
                    <TouchableOpacity
                      key={p.value}
                      onPress={() => setPriority(p.value)}
                      activeOpacity={0.7}
                      style={[
                        styles.priorityChip,
                        isSelected && { backgroundColor: p.bg, borderColor: p.color },
                      ]}
                    >
                      <Text
                        variant="label"
                        style={[styles.priorityChipLabel, isSelected && { color: p.color }]}
                      >
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Submit */}
            <View style={styles.submitWrapper}>
              <Button
                label="Ajouter la tâche"
                onPress={handleSubmit}
                disabled={!canSubmit}
                isLoading={isLoading}
                fullWidth
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: spacing.xl,
    maxHeight: '90%',
    ...shadows.lg,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radii.full,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    color: colors.darkBlue,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  field: {
    gap: spacing.sm,
  },
  fieldLabel: {
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  categoryChipLabel: {
    color: '#9CA3AF',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  priorityChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  priorityChipLabel: {
    color: '#9CA3AF',
  },
  submitWrapper: {
    marginTop: spacing.xs,
  },
});
