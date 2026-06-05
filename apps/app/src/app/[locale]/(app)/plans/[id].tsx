import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyHeader } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useTrainingPlan } from "@/features/plans/hooks/use-training-plan";
import { useActiveUserPlan } from "@/features/users/hooks/use-active-user-plan";
import { useHandleActivePlan } from "@/features/users/hooks/use-handle-active-plan";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

export default function TrainingPlanDetailScreen() {
	const { id } = useLocalSearchParams<"/[locale]/plans/[id]">();
	const { data: plan, error, isLoading, isRefetching, refetch } = useTrainingPlan(id);
	const { data: activePlan } = useActiveUserPlan();
	const { activate, deactivate, isLoading: ishandlingPlan } = useHandleActivePlan();

	const handlePlanAction = () => {
		if (!plan) return;
		if (activePlan?.plan.id === plan.id) {
			deactivate();
		} else {
			activate({ planId: plan.id });
		}
	};

	if (isLoading) {
		return (
			<View className="gap-3 pt-2">
				{Array.from({ length: 3 }, (_, index) => (
					<Empty key={index} className="shadow-sm">
						<EmptyHeader className="items-start pb-4">
							<View className="flex-row items-start gap-3">
								<Skeleton className="mt-0.5 size-11 rounded-full" />
								<View className="flex-1 gap-2">
									<Skeleton className="h-5 w-40" />
									<Skeleton className="h-4 w-full" />
								</View>
							</View>
						</EmptyHeader>
						<EmptyContent className="flex-row flex-wrap gap-2">
							<Skeleton className="h-7 w-24 rounded-full" />
							<Skeleton className="h-7 w-28 rounded-full" />
							<Skeleton className="h-7 w-20 rounded-full" />
						</EmptyContent>
					</Empty>
				))}
			</View>
		);
	}

	return (
		<View className="bg-background flex-1 gap-4">
			<ScrollView refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}>
				<View className="bg-card pt-safe-offset-2 flex-row items-end justify-between gap-3 px-4 pb-4 shadow-sm">
					<View className="items-start justify-between">
						<Text className="text-foreground text-xl font-semibold tracking-tight">{plan?.name}</Text>
						<Text className="text-muted-foreground text-sm">{plan?.description}</Text>
					</View>
					<Button variant={activePlan?.plan.id === plan?.id ? "default" : "outline"} disabled={!plan} onPress={handlePlanAction}>
						<Text>{activePlan?.plan.id === plan?.id ? "Active Plan" : "Activate Plan"}</Text>
					</Button>
				</View>
				<Text>This is the screen for a specific training plan</Text>
			</ScrollView>
		</View>
	);
}
