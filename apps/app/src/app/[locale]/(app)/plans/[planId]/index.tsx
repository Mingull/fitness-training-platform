import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { FABAction, FABLabel, FABTrigger } from "@/components/ui/fab";
import { Icon } from "@/components/ui/icon";
import {
	Scaffold,
	ScaffoldAddon,
	ScaffoldBackButton,
	ScaffoldContent,
	ScaffoldDescription,
	ScaffoldFAB,
	ScaffoldHeader,
	ScaffoldTitle,
} from "@/components/ui/scaffold";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useSession } from "@/features/auth/context";
import { AddWorkoutModal } from "@/features/plans/components/add-workout-modal";
import { useReorderPlanWorkouts } from "@/features/plans/hooks/use-reorder-plan-workouts";
import { useTrainingPlan } from "@/features/plans/hooks/use-training-plan";
import { useActiveUserPlan } from "@/features/users/hooks/use-active-user-plan";
import { useHandleActivePlan } from "@/features/users/hooks/use-handle-active-plan";
import { WorkoutItem } from "@/features/workouts/components/workout-item";
import { WorkoutsEmptyState } from "@/features/workouts/components/workouts-empty-state";
import { type WorkoutItem as WorkoutItemType } from "@fitness/contracts/workouts";
import { BlurTargetView } from "expo-blur";
import { useLocalSearchParams } from "expo-router";
import { PlusIcon } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { NestableDraggableFlatList, NestableScrollContainer, ScaleDecorator, type DragEndParams, type RenderItemParams } from "react-native-draggable-flatlist";
import { RefreshControl } from "react-native-gesture-handler";
import { useTranslations } from "use-intl";

const REORDER_DEBOUNCE_MS = 500;

export default function TrainingPlanDetailScreen() {
	const [isAddWorkoutModalOpen, setIsAddWorkoutModalOpen] = useState(false);
	const [workouts, setWorkouts] = useState<WorkoutItemType[]>([]);
	const [isRefreshEnabled, setIsRefreshEnabled] = useState(true);
	const reorderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const targetRef = useRef<View | null>(null);
	const t = useTranslations("plans.item");
	const { planId } = useLocalSearchParams<"/[locale]/(app)/plans/[planId]">();

	const { userId } = useSession();
	const { data: plan, error, isLoading: isLoadingPlan, isRefetching, refetch } = useTrainingPlan(planId);
	const { data: activePlan } = useActiveUserPlan();
	const { activate, deactivate, isLoading: isHandlingPlan } = useHandleActivePlan();
	const reorderMutator = useReorderPlanWorkouts(planId);

	useEffect(() => {
		if (plan?.workouts) setWorkouts(plan.workouts);
	}, [plan?.workouts]);

	useEffect(() => {
		return () => {
			if (reorderTimeoutRef.current) {
				clearTimeout(reorderTimeoutRef.current);
			}
		};
	}, []);

	const isPlanOwner = useMemo(() => plan?.creator.id === userId, [plan?.creator.id, userId]);
	const isActivePlan = useMemo(() => activePlan?.plan.id === plan?.id, [activePlan?.plan.id, plan?.id]);
	const isDragEnabled = Boolean(isPlanOwner && workouts.length >= 2);

	const handlePlanAction = () => {
		if (!plan) return;
		if (activePlan?.plan.id === plan.id) {
			deactivate();
		} else {
			activate({ planId: plan.id });
		}
	};

	const handleDragEnd = ({ data }: DragEndParams<WorkoutItemType>) => {
		setIsRefreshEnabled(true);
		if (!isPlanOwner) return;

		const didOrderChange = data.some((workout, index) => workout.id !== workouts[index]?.id);
		setWorkouts(data);

		if (!didOrderChange) return;

		if (reorderTimeoutRef.current) {
			clearTimeout(reorderTimeoutRef.current);
		}

		reorderTimeoutRef.current = setTimeout(() => {
			reorderMutator.mutate(data.map((workout, index) => ({ workoutId: workout.id, newOrderIndex: index })));
		}, REORDER_DEBOUNCE_MS);
	};

	if (isLoadingPlan)
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
				<ScaffoldContent>
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
				</ScaffoldContent>
			</Scaffold>
		);

	return (
		<Scaffold>
			<BlurTargetView ref={targetRef} style={{ flex: 1 }}>
				<ScaffoldHeader>
					<ScaffoldBackButton />
					<View className="items-start justify-between">
						<ScaffoldTitle className="text-foreground text-xl font-semibold tracking-tight">{plan?.name}</ScaffoldTitle>
						<ScaffoldDescription className="text-muted-foreground text-sm">{plan?.description}</ScaffoldDescription>
					</View>
					<ScaffoldAddon>
						<Button className="will-change-variable" variant={isActivePlan ? "default" : "outline"} disabled={!plan} onPress={handlePlanAction}>
							<Text>{isActivePlan ? t("actions.activePlan") : t("actions.activatePlan")}</Text>
						</Button>
					</ScaffoldAddon>
				</ScaffoldHeader>
				<NestableScrollContainer
					className="flex-1"
					refreshControl={<RefreshControl enabled={isRefreshEnabled} refreshing={isRefetching} onRefresh={refetch} />}
				>
					<NestableDraggableFlatList
						data={workouts}
						keyExtractor={(item) => item.id}
						renderItem={({ item, drag, isActive }: RenderItemParams<WorkoutItemType>) => (
							<ScaleDecorator activeScale={0.97}>
								<View className="px-4 pb-4">
									<WorkoutItem item={item} planId={planId} drag={drag} isDragEnabled={isDragEnabled} />
								</View>
							</ScaleDecorator>
						)}
						onDragBegin={() => setIsRefreshEnabled(false)}
						onDragEnd={handleDragEnd}
						contentContainerClassName="pt-5 pb-7 grow"
						alwaysBounceVertical
						ListEmptyComponent={
							<WorkoutsEmptyState isOwner={isPlanOwner} error={error} onRetry={refetch} onCreate={() => setIsAddWorkoutModalOpen(true)} />
						}
						showsVerticalScrollIndicator={false}
					/>
				</NestableScrollContainer>
				<ScaffoldFAB disabled={!isPlanOwner}>
					<FABTrigger onPress={() => setIsAddWorkoutModalOpen(true)}>
						<FABLabel>{t("actions.addWorkoutFab")}</FABLabel>
						<FABAction>
							<Icon as={PlusIcon} size={24} />
						</FABAction>
					</FABTrigger>
				</ScaffoldFAB>
			</BlurTargetView>
			<AddWorkoutModal isOpen={isAddWorkoutModalOpen} onClose={() => setIsAddWorkoutModalOpen(false)} targetRef={targetRef} planId={plan?.id || ""} />
		</Scaffold>
	);
}
