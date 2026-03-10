import React, { useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Checkbox } from '@/design-system/components/forms/Checkbox';
import { Icon } from '@/design-system/primitives/Icon';
import { Text } from '@/design-system/primitives/Text';
import { colors, radii, shadows, spacing } from '@/design-system/tokens';
import { Task, TaskCategory } from '../types/task.types';

const DELETE_BUTTON_WIDTH = 88;
const SNAP_THRESHOLD = DELETE_BUTTON_WIDTH / 2;

const CATEGORY_ICONS: Record<TaskCategory, string> = {
  admin: 'FileText',
  finance: 'CreditCard',
  health: 'Heart',
  housing: 'Home',
  practical: 'Smartphone',
};

const CATEGORY_COLORS: Record<TaskCategory, string> = {
  admin: colors.blue,
  finance: colors.gold,
  health: colors.danger,
  housing: colors.success,
  practical: colors.warning,
};

const PRIORITY_LABEL: Record<number, { label: string; color: string; bg: string } | undefined> = {
  1: { label: 'Urgent', color: colors.danger, bg: '#FEF2F2' },
  2: { label: 'Moyen', color: colors.warning, bg: '#FFFBEB' },
};

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onComplete, onDelete }: TaskCardProps) {
  const translateX = useSharedValue(0);
  const [isOpen, setIsOpen] = useState(false);

  const categoryColor = CATEGORY_COLORS[task.category];
  const iconName = CATEGORY_ICONS[task.category];
  const priorityInfo = PRIORITY_LABEL[task.priority];

  const close = () => {
    translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
    setIsOpen(false);
  };

  const open = () => {
    translateX.value = withSpring(-DELETE_BUTTON_WIDTH, { damping: 20, stiffness: 200 });
    setIsOpen(true);
  };

  const gesture = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-10, 10])
    .onUpdate((e) => {
      const base = isOpen ? -DELETE_BUTTON_WIDTH : 0;
      const next = base + e.translationX;
      // Only allow sliding left (negative) or recovering
      translateX.value = Math.min(0, next);
    })
    .onEnd((e) => {
      const currentlyOpen = isOpen;
      const translation = e.translationX;

      if (currentlyOpen) {
        // Swipe right enough → close
        if (translation > SNAP_THRESHOLD) {
          runOnJS(close)();
        } else {
          runOnJS(open)();
        }
      } else {
        // Swipe left enough → open
        if (translation < -SNAP_THRESHOLD) {
          runOnJS(open)();
        } else {
          runOnJS(close)();
        }
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.wrapper}>
      {/* Delete button — only rendered when card is open */}
      {isOpen && (
        <View style={styles.deleteButtonContainer}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(task.id)}
            activeOpacity={0.8}
          >
            <Icon name="Trash2" size={20} color={colors.white} />
            <Text variant="label" style={styles.deleteButtonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tap-to-close overlay when card is open */}
      {isOpen && (
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
      )}

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card, task.isCompleted && styles.cardDone, cardStyle]}>
          <Checkbox
            checked={task.isCompleted}
            onPress={() => {
              if (isOpen) {
                close();
                return;
              }
              onComplete(task.id);
            }}
            size={26}
          />

          <View style={[styles.iconWrapper, { backgroundColor: `${categoryColor}18` }]}>
            <Icon name={iconName} size={18} color={categoryColor} />
          </View>

          <View style={styles.content}>
            <Text
              variant="bodyMedium"
              style={[styles.title, task.isCompleted && styles.titleDone]}
              numberOfLines={2}
            >
              {task.title}
            </Text>
            <View style={styles.meta}>
              {task.deadline && !task.isCompleted && (
                <View style={styles.deadline}>
                  <Icon name="Clock" size={12} color="#9CA3AF" />
                  <Text variant="caption" style={styles.deadlineText}>
                    {formatDeadline(task.deadline)}
                  </Text>
                </View>
              )}
              {task.isCompleted && (
                <Text variant="caption" style={styles.completedText}>✓ Terminé</Text>
              )}
              {!task.isCompleted && priorityInfo && (
                <View style={[styles.priorityBadge, { backgroundColor: priorityInfo.bg }]}>
                  <Text variant="caption" style={[styles.priorityText, { color: priorityInfo.color }]}>
                    {priorityInfo.label}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

function formatDeadline(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'En retard';
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Demain';
  return `Dans ${diffDays}j`;
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  deleteButtonContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: DELETE_BUTTON_WIDTH,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: radii.md,
  },
  deleteButtonText: {
    color: colors.white,
    fontSize: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  cardDone: {
    opacity: 0.55,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: '#1F2937',
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  deadline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deadlineText: {
    color: '#9CA3AF',
  },
  completedText: {
    color: colors.success,
  },
  priorityBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
