import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ScreenWrapper } from '@/design-system/components/layout/ScreenWrapper';
import { ProgressBar } from '@/design-system/components/data-display/ProgressBar';
import { EmptyState } from '@/design-system/components/feedback/EmptyState';
import { Skeleton } from '@/design-system/components/feedback/Skeleton';
import { FAB } from '@/design-system/components/actions/FAB';
import { Text } from '@/design-system/primitives/Text';
import { colors, spacing } from '@/design-system/tokens';
import { useChecklist } from '../hooks/useChecklist';
import { useTaskMutation } from '../hooks/useTaskMutation';
import { TaskCard } from '../components/TaskCard';
import { TaskCategoryTabs, ChecklistTab } from '../components/TaskCategoryTabs';
import { AddTaskModal } from '../components/AddTaskModal';
import { CreateTaskPayload } from '../services/checklist.service';

export function ChecklistScreen() {
  const [activeTab, setActiveTab] = useState<ChecklistTab>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    tasks,
    completedCount,
    totalCount,
    progress,
    taskCountByCategory,
    isLoading,
    mobilityId,
  } = useChecklist(activeTab);

  const { completeTask, createTask, deleteTask } = useTaskMutation(mobilityId);

  const handleComplete = (id: string) => {
    completeTask.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteTask.mutate(id);
  };

  const handleAddTask = (payload: CreateTaskPayload) => {
    createTask.mutate(payload, { onSuccess: () => setIsModalVisible(false) });
  };

  if (isLoading && totalCount === 0) {
    return (
      <ScreenWrapper>
        <View style={styles.skeletonWrapper}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} style={styles.skeletonItem} />
          ))}
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="heading2" style={styles.headerTitle}>Checklist</Text>
        <Text variant="body" style={styles.headerSub}>
          {completedCount}/{totalCount} tâches complétées
        </Text>
        <View style={styles.progressWrapper}>
          <ProgressBar progress={progress * 100} />
        </View>
      </View>

      {/* Tabs */}
      <TaskCategoryTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        taskCounts={taskCountByCategory}
      />

      {/* Task list */}
      <View style={styles.listContainer}>
        {tasks.length === 0 ? (
          <EmptyState
            title="Aucune tâche ici"
            message="Ajoute ta première tâche en appuyant sur le bouton +"
            ctaLabel="Ajouter une tâche"
            onCta={() => setIsModalVisible(true)}
          />
        ) : (
          <ScrollView
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          >
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />
            ))}
            <View style={styles.listBottomPad} />
          </ScrollView>
        )}

        {/* FAB */}
        <FAB onPress={() => setIsModalVisible(true)} iconName="Plus" />
      </View>

      {/* Add task modal */}
      <AddTaskModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleAddTask}
        isLoading={createTask.isPending}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.bg,
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerIcon: {
    marginBottom: spacing.xs,
  },
  headerTitle: {
    color: colors.darkBlue,
    marginBottom: 4,
  },
  headerSub: {
    color: '#6B7280',
    marginBottom: spacing.sm,
  },
  progressWrapper: {
    marginTop: spacing.xs,
  },
  listContainer: {
    flex: 1,
    position: 'relative',
  },
  list: {
    padding: spacing.md,
  },
  listBottomPad: {
    height: 80,
  },
  skeletonWrapper: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  skeletonItem: {
    height: 72,
    borderRadius: 12,
  },
});
