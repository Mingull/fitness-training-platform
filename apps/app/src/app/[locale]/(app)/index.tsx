import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Scaffold, ScaffoldAddon, ScaffoldContent, ScaffoldDescription, ScaffoldHeader, ScaffoldTitle } from "@/components/ui/scaffold";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useSession } from "@/features/auth/context";
import { useNotificationSocket } from "@/features/notifications/hooks/use-notification-socket";
import { useTrainingPlans } from "@/features/plans/hooks/use-training-plans";
import { useTrainerRequests } from "@/features/trainer-requests/hooks/use-trainer-requests";
import { useActiveUserPlan } from "@/features/users/hooks/use-active-user-plan";
import { useProfile } from "@/features/users/profile/hooks/use-profile";
import { useRouter } from "expo-router";
import { Bell, CalendarClock, ChevronRight, ClipboardList, Compass, Dumbbell, UserCheck2 } from "lucide-react-native";
import { RefreshControl, View } from "react-native";
import { useLocale, useTranslations } from "use-intl";

function formatDuration(minutes: number) {
	if (minutes < 60) {
		return `${minutes} min`;
	}

	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	if (remainingMinutes === 0) {
		return `${hours}h`;
	}

	return `${hours}h ${remainingMinutes}m`;
}

export default function HomeScreen() {
	const router = useRouter();
	const locale = useLocale();
	const t = useTranslations("home");
	const { unreadCount } = useNotificationSocket();
	const { userRole } = useSession();
	const { data: profile } = useProfile();
	const {
		data: activePlan,
		isLoading: isLoadingActivePlan,
		error: activePlanError,
		isRefetching: isRefetchingActivePlan,
		refetch: refetchActivePlan,
	} = useActiveUserPlan();
	const { data: allPlans, isLoading: isLoadingPlans, isRefetching: isRefetchingPlans, error: plansError, refetch: refetchPlans } = useTrainingPlans();
	const {
		data: trainerRequests,
		isLoading: isLoadingRequests,
		isRefetching: isRefetchingRequests,
		error: requestsError,
		refetch: refetchRequests,
	} = useTrainerRequests({ enabled: userRole !== "Sporter" });

	const isRefreshing = isRefetchingActivePlan || isRefetchingPlans || isRefetchingRequests;
	const pendingRequests = trainerRequests?.filter((request) => request.status.value === "pending") ?? [];
	const latestRequest = trainerRequests?.[0];
	const sporterRequestStatus = latestRequest ? t(`requestStatus.values.${latestRequest.status.value}`) : t("stats.noRequest");

	const handleRefresh = async () => {
		await Promise.all([refetchActivePlan(), refetchPlans(), userRole !== "Sporter" ? refetchRequests() : Promise.resolve()]);
	};

	return (
		<Scaffold>
			<ScaffoldHeader className="items-start justify-between gap-3">
				<View>
					<ScaffoldDescription>{t("header.welcomeBack")}</ScaffoldDescription>
					<ScaffoldTitle className="text-xl">{profile ? `${profile.firstName} ${profile.lastName}` : t("header.fallbackTitle")}</ScaffoldTitle>
				</View>
				{!profile?.roles.includes("Sporter") ?
					<ScaffoldAddon>
						<Button variant="outline" size="icon-lg" onPress={() => router.push({ pathname: "/[locale]/(app)/notifications", params: { locale } })}>
							<Icon as={Bell} />
							{unreadCount > 0 && (
								<View className="bg-destructive absolute -top-1 -right-1 rounded-full px-1.5 py-0.5">
									<Text className="text-xs text-white">{unreadCount > 9 ? "9+" : unreadCount}</Text>
								</View>
							)}
						</Button>
					</ScaffoldAddon>
				:	null}
			</ScaffoldHeader>

			<ScaffoldContent scrollable refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />} className="pb-28">
				<View className="flex-row gap-3">
					<Card className="flex-1" data-size="sm">
						<CardContent className="pt-4">
							<View className="mb-2 flex-row items-center justify-between">
								<Text className="text-muted-foreground text-xs">{t("stats.plansAvailable")}</Text>
								<Icon as={ClipboardList} className="text-muted-foreground" size={16} />
							</View>
							<Text className="text-2xl font-semibold">{isLoadingPlans ? "..." : (allPlans?.length ?? 0)}</Text>
						</CardContent>
					</Card>
					<Card className="flex-1" data-size="sm">
						<CardContent className="pt-4">
							<View className="mb-2 flex-row items-center justify-between">
								<Text className="text-muted-foreground text-xs">
									{userRole === "Sporter" ? t("stats.trainerRequestStatus") : t("stats.pendingRequests")}
								</Text>
								<Icon as={UserCheck2} className="text-muted-foreground" size={16} />
							</View>
							<Text className="text-2xl font-semibold">{userRole === "Sporter" ? sporterRequestStatus : pendingRequests.length}</Text>
						</CardContent>
					</Card>
				</View>

				<Card>
					<CardHeader>
						<CardTitle>{t("activePlan.title")}</CardTitle>
						<CardDescription>{t("activePlan.description")}</CardDescription>
					</CardHeader>
					<CardContent className="gap-3">
						{isLoadingActivePlan ?
							<View className="gap-2">
								<Skeleton className="h-5 w-3/4" />
								<Skeleton className="h-4 w-2/4" />
								<Skeleton className="h-9 w-full" />
							</View>
						: activePlanError ?
							<View className="gap-3">
								<Text className="text-destructive">{t("activePlan.errors.loadFailed")}</Text>
								<Button variant="outline" onPress={() => refetchActivePlan()}>
									<Text>{t("actions.tryAgain")}</Text>
								</Button>
							</View>
						: activePlan ?
							<>
								<View className="gap-1">
									<Text className="text-lg font-semibold">{activePlan.plan.name}</Text>
									<Text className="text-muted-foreground">{activePlan.plan.description}</Text>
								</View>
								<View className="flex-row items-center gap-2">
									<Badge variant="outline">
										<Text>{t(`difficulty.${activePlan.plan.difficulty.label}`)}</Text>
									</Badge>
									<Badge variant="muted">
										<Text>{formatDuration(activePlan.plan.estimatedDuration)}</Text>
									</Badge>
								</View>
								<Button
									onPress={() => router.push({ pathname: "/[locale]/(app)/plans/[planId]", params: { locale, planId: activePlan.plan.id } })}
								>
									<Text>{t("actions.openActivePlan")}</Text>
								</Button>
							</>
						:	<>
								<Text className="text-muted-foreground">{t("activePlan.empty")}</Text>
								<Button variant="outline" onPress={() => router.push({ pathname: "/[locale]/(app)/my-plans", params: { locale } })}>
									<Text>{t("actions.choosePlan")}</Text>
								</Button>
							</>
						}
					</CardContent>
				</Card>

				{userRole !== "Sporter" && (
					<Card>
						<CardHeader>
							<CardTitle>{t("requestStatus.title")}</CardTitle>
							<CardDescription>
								{userRole === "Sporter" ? t("requestStatus.sporterDescription") : t("requestStatus.trainerDescription")}
							</CardDescription>
						</CardHeader>
						<CardContent className="gap-3">
							{isLoadingRequests ?
								<View className="gap-2">
									<Skeleton className="h-5 w-2/3" />
									<Skeleton className="h-4 w-1/2" />
								</View>
							: requestsError ?
								<>
									<Text className="text-destructive">{t("requestStatus.errors.loadFailed")}</Text>
									<Button variant="outline" onPress={() => refetchRequests()}>
										<Text>{t("actions.tryAgain")}</Text>
									</Button>
								</>
							: latestRequest ?
								<>
									<View className="flex-row items-center justify-between">
										<View className="flex-1">
											<Text className="font-medium">
												{latestRequest.sporter.firstName} {latestRequest.sporter.lastName}
											</Text>
											<Text className="text-muted-foreground text-sm">@{latestRequest.sporter.username}</Text>
										</View>
										<Badge
											variant={
												latestRequest.status.value === "pending" ? "default"
												: latestRequest.status.value === "accepted" ?
													"secondary"
												:	"destructive"
											}
										>
											<Text>{t(`requestStatus.values.${latestRequest.status.value}`)}</Text>
										</Badge>
									</View>
									<Button variant="outline" onPress={() => router.push({ pathname: "/[locale]/(app)/requests", params: { locale } })}>
										<Text>{t("actions.viewAllRequests")}</Text>
									</Button>
								</>
							:	<>
									<Text className="text-muted-foreground">{t("requestStatus.empty")}</Text>
									<Button variant="outline" onPress={() => refetchRequests()}>
										<Text>{t("actions.refresh")}</Text>
									</Button>
								</>
							}
						</CardContent>
					</Card>
				)}

				<Card>
					<CardHeader>
						<CardTitle>{t("quickActions.title")}</CardTitle>
						<CardDescription>{t("quickActions.description")}</CardDescription>
					</CardHeader>
					<CardContent className="gap-2">
						<Button
							variant="outline"
							className="justify-between"
							onPress={() => router.push({ pathname: "/[locale]/(app)/my-plans", params: { locale } })}
						>
							<View className="flex-row items-center gap-2">
								<Icon as={Dumbbell} size={16} />
								<Text>{t("quickActions.items.myPlans")}</Text>
							</View>
							<Icon as={ChevronRight} size={16} />
						</Button>
						<Button
							variant="outline"
							className="justify-between"
							onPress={() => router.push({ pathname: "/[locale]/(app)/explore", params: { locale } })}
						>
							<View className="flex-row items-center gap-2">
								<Icon as={Compass} size={16} />
								<Text>{t("quickActions.items.explore")}</Text>
							</View>
							<Icon as={ChevronRight} size={16} />
						</Button>
						{userRole === "Sporter" && (
							<Button
								variant="outline"
								className="justify-between"
								onPress={() => router.push({ pathname: "/[locale]/(app)/notifications", params: { locale } })}
							>
								<View className="flex-row items-center gap-2">
									<Icon as={Bell} size={16} />
									<Text>{t("quickActions.items.notifications")}</Text>
								</View>
								<Icon as={ChevronRight} size={16} />
							</Button>
						)}
						<Button
							variant="outline"
							className="justify-between"
							onPress={() => router.push({ pathname: "/[locale]/(app)/profile", params: { locale } })}
						>
							<View className="flex-row items-center gap-2">
								<Icon as={CalendarClock} size={16} />
								<Text>{t("quickActions.items.profile")}</Text>
							</View>
							<Icon as={ChevronRight} size={16} />
						</Button>
					</CardContent>
				</Card>

				{plansError && <Text className="text-muted-foreground text-center text-xs">{t("errors.planRefresh")}</Text>}
			</ScaffoldContent>
		</Scaffold>
	);
}
