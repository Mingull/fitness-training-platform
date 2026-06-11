import { Badge } from "@/components/ui/badge";
import { FABAction, FABLabel, FABTrigger } from "@/components/ui/fab";
import { Icon } from "@/components/ui/icon";
import { Scaffold, ScaffoldAddon, ScaffoldDescription, ScaffoldFAB, ScaffoldHeader, ScaffoldTitle } from "@/components/ui/scaffold";
import { Text } from "@/components/ui/text";
import { useSession } from "@/features/auth/context";
import { PlanItem } from "@/features/plans/components/plan-item";
import { PlansEmptyState } from "@/features/plans/components/plans-empty-state";
import { useTrainingPlans } from "@/features/plans/hooks/use-training-plans";
import { useRouter } from "expo-router";
import { PlusIcon } from "lucide-react-native";
import { FlatList, View } from "react-native";
import { useLocale, useTranslations } from "use-intl";

export default function TrainingPlanListScreen() {
	const locale = useLocale();
	const router = useRouter();
	const t = useTranslations("trainingPrograms");
	const session = useSession();
	const { data, error, isLoading, isRefetching, refetch } = useTrainingPlans();
	const plans = data ?? [];

	return (
		<Scaffold>
			<ScaffoldHeader>
				<View className="items-start justify-between">
					<ScaffoldTitle className="text-foreground text-xl font-semibold tracking-tight">{t("header.title")}</ScaffoldTitle>
					<ScaffoldDescription className="text-muted-foreground text-sm">{t("header.available", { count: plans.length })}</ScaffoldDescription>
				</View>
				<ScaffoldAddon>
					<Badge variant={isRefetching || isLoading ? "default" : "muted"}>
						<Text className={`${isRefetching || isLoading ? "text-primary" : "text-muted-foreground"} text-xs font-semibold`}>
							{isRefetching ?
								t("header.badge.refreshing")
							: isLoading ?
								t("header.badge.loading")
							:	t("header.badge.updated")}
						</Text>
					</Badge>
				</ScaffoldAddon>
			</ScaffoldHeader>
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
			{!isLoading && !error && (
				<ScaffoldFAB>
					<FABTrigger
						onPress={() => {
							router.push({ pathname: "/[locale]/plans/create", params: { locale } });
						}}
					>
						<FABLabel>Create Plan</FABLabel>
						<FABAction>
							<Icon as={PlusIcon} size={24} />
						</FABAction>
					</FABTrigger>
					{/* <FABSpeedDial>
					<FABSpeedDialItem>
						<FABSpeedDialLabel>Create from Template</FABSpeedDialLabel>
						<FABSpeedDialTrigger>
							<Icon as={PlusIcon} size={24} />
						</FABSpeedDialTrigger>
					</FABSpeedDialItem>
				</FABSpeedDial> */}
				</ScaffoldFAB>
			)}
		</Scaffold>
	);
}
