import { Card, CardHeader } from "@/components/ui/card";
import { FABAction, FABLabel, FABTrigger } from "@/components/ui/fab";
import { Icon } from "@/components/ui/icon";
import { Scaffold, ScaffoldAddon, ScaffoldBackButton, ScaffoldDescription, ScaffoldFAB, ScaffoldHeader, ScaffoldTitle } from "@/components/ui/scaffold";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useSession } from "@/features/auth/context";
import { ExerciseItem } from "@/features/exercises/components/exercise-item";
import { ExercisesEmptyState } from "@/features/exercises/components/exercises-empty-state";
import { useTrainingPlan } from "@/features/plans/hooks/use-training-plan";
import { AddExerciseModal } from "@/features/workouts/components/modal/add-exercise-modal";
import { useReorderWorkoutExercises } from "@/features/workouts/hooks/use-reorder-workout-exercises";
import { useWorkout } from "@/features/workouts/hooks/use-workout";
import type { ExerciseDetailItem } from "@fitness/contracts/exercises";
import { BlurTargetView } from "expo-blur";
import { useLocalSearchParams } from "expo-router";
import { PlusIcon } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { DragEndParams, NestableDraggableFlatList, NestableScrollContainer, RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import { RefreshControl } from "react-native-gesture-handler";
import { useTranslations } from "use-intl";

const REORDER_DEBOUNCE_MS = 500;

export default function TrainingPlanWorkoutScreen() {
	const [isAddWorkoutModalOpen, setIsAddWorkoutModalOpen] = useState(false);
	const [isRefreshEnabled, setIsRefreshEnabled] = useState(true);
	const [exercises, setExercises] = useState<ExerciseDetailItem[]>([]);
	const targetRef = useRef<View | null>(null);
	const reorderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const { planId, workoutId } = useLocalSearchParams<"/[locale]/plans/[planId]/workouts/[workoutId]">();
	const t = useTranslations("plans.workouts.item");

	const { userId } = useSession();
	const { data: plan, isLoading: isLoadingPlan } = useTrainingPlan(planId);
	const {
		data: workout,
		error: workoutError,
		isLoading: isLoadingWorkout,
		isRefetching: isRefetchingWorkout,
		refetch: refetchWorkout,
	} = useWorkout(workoutId);
	const reorderMutator = useReorderWorkoutExercises(workoutId);

	useEffect(() => {
		if (workout?.exercises) setExercises(workout.exercises);
	}, [workout?.exercises]);

	useEffect(() => {
		return () => {
			if (reorderTimeoutRef.current) {
				clearTimeout(reorderTimeoutRef.current);
			}
		};
	}, []);

	const isPlanOwner = useMemo(() => plan?.creator.id === userId, [plan?.creator.id, userId]);
	const isDragEnabled = Boolean(isPlanOwner && exercises.length >= 2);
	const workoutTitle = workout?.name ?? "Workout";
	const exercisesLabel = `${exercises.length} exercise${exercises.length === 1 ? "" : "s"}`;
	const workoutSubtitle = plan?.name ? `${plan.name} - ${exercisesLabel}` : exercisesLabel;

	const handleDragEnd = ({ data }: DragEndParams<ExerciseDetailItem>) => {
		setIsRefreshEnabled(true);
		if (!isPlanOwner) return;

		const didOrderChange = data.some((exercise, index) => exercise.id !== exercises[index]?.id);
		setExercises(data);

		if (!didOrderChange) return;
		if (reorderTimeoutRef.current) {
			clearTimeout(reorderTimeoutRef.current);
		}

		reorderTimeoutRef.current = setTimeout(() => {
			reorderMutator.mutate(data.map((exercise, index) => ({ exerciseId: exercise.id, newOrderIndex: index + 1 })));
		}, REORDER_DEBOUNCE_MS);
	};

	if (isLoadingPlan || isLoadingWorkout)
		return (
			<Scaffold>
				<ScaffoldHeader>
					<View className="items-start justify-between gap-2">
						<Skeleton className="h-5 w-64" />
						<Skeleton className="h-3 w-48" />
					</View>
					<ScaffoldAddon>
						<Skeleton className="h-6 w-18" />
					</ScaffoldAddon>
				</ScaffoldHeader>
				<View>
					<View className="gap-3 px-4 pt-2 pb-4">
						{Array.from({ length: 3 }, (_, index) => (
							<Card key={index} className="shadow-sm">
								<CardHeader className="items-start">
									<View className="flex-row items-start gap-3">
										<Skeleton className="mt-0.5 size-11 rounded-full" />
										<View className="flex-1 gap-2">
											<Skeleton className="h-5 w-40" />
											<Skeleton className="h-4 w-full" />
										</View>
									</View>
								</CardHeader>
							</Card>
						))}
					</View>
				</View>
			</Scaffold>
		);

	return (
		<Scaffold>
			<BlurTargetView ref={targetRef} style={{ flex: 1 }}>
				<ScaffoldHeader>
					<ScaffoldBackButton />
					<View className="items-start justify-between">
						<ScaffoldTitle className="text-foreground text-xl font-semibold tracking-tight">{workoutTitle}</ScaffoldTitle>
						<ScaffoldDescription className="text-muted-foreground text-sm">{workoutSubtitle}</ScaffoldDescription>
					</View>
					<ScaffoldAddon>{isDragEnabled && <Text className="text-muted-foreground text-xs font-medium">Drag to reorder</Text>}</ScaffoldAddon>
				</ScaffoldHeader>
				<NestableScrollContainer
					className="flex-1"
					refreshControl={<RefreshControl enabled={isRefreshEnabled} refreshing={isRefetchingWorkout} onRefresh={refetchWorkout} />}
				>
					<NestableDraggableFlatList
						data={exercises}
						keyExtractor={(item) => item.id}
						renderItem={({ item, drag }: RenderItemParams<ExerciseDetailItem>) => (
							<ScaleDecorator activeScale={0.97}>
								<View className="px-4 pb-4">
									<ExerciseItem item={item} drag={drag} isDragEnabled={isDragEnabled} />
								</View>
							</ScaleDecorator>
						)}
						onDragBegin={() => setIsRefreshEnabled(false)}
						onDragEnd={handleDragEnd}
						contentContainerClassName="pt-5 pb-7 grow"
						alwaysBounceVertical
						ListEmptyComponent={
							<ExercisesEmptyState error={workoutError} onRetry={refetchWorkout} onCreate={() => setIsAddWorkoutModalOpen(true)} />
						}
						showsVerticalScrollIndicator={false}
					/>
				</NestableScrollContainer>
				<ScaffoldFAB disabled={!isPlanOwner}>
					<FABTrigger onPress={() => setIsAddWorkoutModalOpen(true)}>
						<FABLabel>{t("actions.addExerciseFab")}</FABLabel>
						<FABAction>
							<Icon as={PlusIcon} size={24} />
						</FABAction>
					</FABTrigger>
				</ScaffoldFAB>
			</BlurTargetView>
			<AddExerciseModal
				isOpen={isAddWorkoutModalOpen}
				onClose={() => setIsAddWorkoutModalOpen(false)}
				targetRef={targetRef}
				workoutId={workout?.id || ""}
			/>
		</Scaffold>
	);
}
