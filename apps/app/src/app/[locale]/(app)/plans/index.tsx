import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { useSession } from "@/features/auth/context";
import { PlanItem } from "@/features/plans/components/plan-item";
import { PlansEmptyState } from "@/features/plans/components/plans-empty-state";
import { useTrainingPlans } from "@/features/plans/hooks/use-training-plans";
import { FlatList, View } from "react-native";
import { useTranslations } from "use-intl";

export default function TrainingPlanListScreen() {
	const t = useTranslations("trainingPrograms");
	const session = useSession();
	const { data, error, isLoading, isRefetching, refetch } = useTrainingPlans();
	const plans = data ?? [];

	return (
		<View className="bg-background flex-1 gap-4">
			<View className="bg-card pt-safe flex-row items-end justify-between gap-3 px-4 pb-4 shadow-sm">
				<View className="items-start justify-between">
					<Text className="text-foreground text-xl font-semibold tracking-tight">{t("header.title")}</Text>
					<Text className="text-muted-foreground text-sm">{t("header.available", { count: plans.length })}</Text>
				</View>
				<Badge variant={isRefetching || isLoading ? "default" : "muted"}>
					<Text className={`${isRefetching || isLoading ? "text-primary" : "text-muted-foreground"} text-xs font-semibold`}>
						{isRefetching ?
							t("header.badge.refreshing")
						: isLoading ?
							t("header.badge.loading")
						:	t("header.badge.updated")}
					</Text>
				</Badge>
			</View>
			<FlatList
				data={plans}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <PlanItem item={item} authorId={session?.userId} />}
				refreshing={isRefetching}
				onRefresh={refetch}
				contentContainerClassName="px-4 pb-6 gap-4"
				ListEmptyComponent={<PlansEmptyState isLoading={isLoading} error={error} onRetry={refetch} />}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}
