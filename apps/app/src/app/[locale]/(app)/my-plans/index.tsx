import { Badge } from "@/components/ui/badge";
import { FABAction, FABLabel, FABTrigger } from "@/components/ui/fab";
import { Icon } from "@/components/ui/icon";
import { Scaffold, ScaffoldAddon, ScaffoldDescription, ScaffoldFAB, ScaffoldHeader, ScaffoldTitle } from "@/components/ui/scaffold";
import { Section, SectionTitle } from "@/components/ui/section";
import { Text } from "@/components/ui/text";
import { useSession } from "@/features/auth/context";
import { PlanItem } from "@/features/plans/components/plan-item";
import { PlansEmptyState } from "@/features/plans/components/plans-empty-state";
import { useMyTrainingPlans } from "@/features/users/hooks/use-my-training-plans";
import { useActiveUserPlan } from "@/features/users/hooks/use-active-user-plan";
import { useRouter } from "expo-router";
import { PlusIcon } from "lucide-react-native";
import { FlatList, View } from "react-native";
import { useLocale, useTranslations } from "use-intl";

export default function TrainingPlanListScreen() {
	const locale = useLocale();
	const router = useRouter();
	const t = useTranslations("myPlans");
	const session = useSession();
	const { data: myPlans, error, isLoading, isRefetching, refetch } = useMyTrainingPlans();
	const { data: activePlan, isLoading: isLoadingActivePlan, error: errorActivePlan } = useActiveUserPlan();
	// if my plans includes the active plan, remove the active plan from the list of my plans to avoid showing it twice
	const plans = activePlan ? myPlans?.filter((plan) => plan.id !== activePlan.plan.id) ?? [] : myPlans ?? [];
	// count all plans including the active plan if it's not already in the list of my plans
	const planCount = activePlan && !plans.some((plan) => plan.id === activePlan.plan.id) ? plans.length + 1 : plans.length;

	console.log({ plans, activePlan, errorActivePlan });

	return (
		<Scaffold>
			<ScaffoldHeader>
				<View className="items-start justify-between gap-1">
					<ScaffoldTitle className="text-foreground text-xl font-semibold tracking-tight">{t("list.header.title")}</ScaffoldTitle>
					<ScaffoldDescription className="text-muted-foreground text-sm">{t("list.header.available", { count: planCount })}</ScaffoldDescription>
					<Text className="text-muted-foreground text-xs">Browse a plan to open its workouts and exercise details.</Text>
				</View>
				<ScaffoldAddon>
					<View className="flex-row items-center gap-2">
						<Badge variant={isRefetching || isLoading ? "default" : "muted"}>
							<Text className={`${isRefetching || isLoading ? "text-primary" : "text-muted-foreground"} text-xs font-semibold`}>
								{isRefetching ?
									t("list.header.badge.refreshing")
								: isLoading ?
									t("list.header.badge.loading")
								:	t("list.header.badge.updated")}
							</Text>
						</Badge>
					</View>
				</ScaffoldAddon>
			</ScaffoldHeader>
			{activePlan && (
				<Section className="px-4">
					<SectionTitle>Your Active Plan</SectionTitle>
					<PlanItem item={activePlan?.plan} authorId={session?.userId} active />
				</Section>
			)}
			<Section className="px-4">
				<SectionTitle>All your Plans</SectionTitle>
				<FlatList
					data={plans}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => <PlanItem item={item} authorId={session?.userId} />}
					refreshing={isRefetching}
					onRefresh={refetch}
					contentContainerClassName="gap-4"
					ListEmptyComponent={
						<PlansEmptyState
							isLoading={isLoading}
							error={error}
							onRetry={refetch}
							onCreate={() => router.push({ pathname: "/[locale]/(app)/my-plans/create", params: { locale } })}
						/>
					}
					showsVerticalScrollIndicator={false}
				/>
			</Section>
			{!isLoading && !error && (
				<ScaffoldFAB>
					<FABTrigger onPress={() => router.push({ pathname: "/[locale]/(app)/my-plans/create", params: { locale } })}>
						<FABLabel>{t("list.actions.createPlanFab")}</FABLabel>
						<FABAction>
							<Icon as={PlusIcon} size={24} />
						</FABAction>
					</FABTrigger>
				</ScaffoldFAB>
			)}
		</Scaffold>
	);
}
