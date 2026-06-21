import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useRequestTrainer } from "@/features/trainer-requests/hooks/use-request-trainer";
import { useRequestTrainerStatus } from "@/features/trainer-requests/hooks/use-request-trainer-status";
import { ProfileAction } from "@/features/users/profile/components/profile-action";
import { ProfileRow } from "@/features/users/profile/components/profile-row";
import { useProfile } from "@/features/users/profile/hooks/use-profile";
import { ClientError } from "@fitness/api-client/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, XIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { useTranslations } from "use-intl";

export default function ProfileScreen() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const router = useRouter();
	const t = useTranslations("user.profile");
	const { profileId } = useLocalSearchParams<"/[locale]/(app)/explore/[profileId]">();
	const { data, isLoading, error, isRefetching, refetch } = useProfile(Array.isArray(profileId) ? profileId[0] : profileId);
	const {
		data: trainingStatus,
		isLoading: isTrainingStatusLoading,
		isRefetching: isTrainingStatusRefetching,
		refetch: refetchTrainingStatus,
	} = useRequestTrainerStatus(Array.isArray(profileId) ? profileId[0] : profileId);
	const mutator = useRequestTrainer();

	const handleRequestTraining = async () => {
		try {
			await mutator.mutateAsync({
				trainerId: Array.isArray(profileId) ? profileId[0] : profileId,
			});
		} catch (error) {
			setErrorMessage((error as ClientError).message);
		} finally {
			setTimeout(() => {
				setErrorMessage(null);
			}, 5000);
		}
	};

	const handleRefresh = async () => {
		await Promise.all([refetch(), refetchTrainingStatus()]);
	};

	useEffect(() => {
		console.log({ trainingStatus });
	}, [trainingStatus]);

	return (
		<View className="bg-primary pt-safe flex-1">
			<ScrollView
				className="flex-1"
				contentContainerClassName="grow"
				refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />}
			>
				<View className="mt-2 flex-row items-center justify-between px-4">
					<Button variant="ghost" size="icon" onPress={() => router.back()}>
						<Icon as={ChevronLeft} size={14 * 1.5} strokeWidth={3} className="text-primary-foreground" />
					</Button>
					<Text className="text-primary-foreground text-center text-lg font-medium">{isLoading ? t("status.loading") : t("header.title")}</Text>
					<View className="size-8" />
				</View>
				<View className="h-full">
					{isLoading ?
						<View className="flex-1">
							<View className="items-center pt-4 pb-4">
								{/* Profile Picture and Name */}
								<Skeleton className="size-32 rounded-full" />
								<Skeleton className="mt-3 h-6 w-40" />
								<Skeleton className="mt-1 h-4 w-24" />
							</View>
							{/* Profile Details */}
							{/* <View className="bg-card flex-1 gap-2 rounded-4xl p-6 mt-6 h-full shadow-sm"> */}
							<View className="bg-card flex-1 gap-2 rounded-4xl p-6 shadow-sm">
								{/* Info Rows */}
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-8 w-full" />

								{/* Actions */}
								<View className="mt-auto gap-2">
									<Skeleton className="h-10 w-full" />
									<Skeleton className="h-10 w-full" />
								</View>
							</View>
						</View>
					: !isLoading && error ?
						<View className="flex-1">
							<View className="items-center pt-4 pb-4">
								<View className="bg-destructive/50 size-32 items-center justify-center rounded-full">
									<Icon as={XIcon} size={14 * 2} strokeWidth={3} className="text-primary-foreground text-2xl font-bold" />
								</View>

								<Text className="text-destructive mt-3 text-xl font-semibold">{error.message || t("status.failed")}</Text>
								<Text className="text-sm text-white/80">{t("status.tryAgainLater")}</Text>
							</View>

							<View className="bg-card flex-1 gap-2 rounded-4xl p-6 shadow-sm">
								<ProfileAction label={t("actions.retry")} onPress={refetch} />
							</View>
						</View>
					: !isLoading && data ?
						<View className="relative flex-1">
							<View className="items-center pt-4 pb-4">
								<Avatar alt={data.username} className="size-32">
									<AvatarImage source={{ uri: data.pictureUrl }} />
									<AvatarFallback className="size-32 items-center justify-center rounded-full bg-white/20">
										<Text className="text-primary-foreground text-2xl font-bold">
											{(data.firstName?.[0] || "") + (data.lastName?.[0] || "")}
										</Text>
									</AvatarFallback>
								</Avatar>

								<Text className="text-primary-foreground mt-1 text-xl font-semibold">
									{data.firstName} {data.lastName}
								</Text>
								<Text className="text-muted-foreground text-sm">@{data.username}</Text>
							</View>

							<View className="bg-card flex-1 gap-2 rounded-4xl p-6 shadow-sm">
								<ProfileRow label={t("fields.email.label")} value={data.email} />
								<ProfileRow label={t("fields.role.label")} value={data.roles[0]} />
								<ProfileRow label={t("fields.experience.label")} value={t(`fields.experience.options.${data.experienceLevel}`)} />
								<ProfileRow label={t("fields.goals.label")} value={data.goals ?? t("fields.goals.empty")} vertical />
								<ProfileRow label={t("fields.bio.label")} value={data.bio ?? t("fields.bio.empty")} vertical />
								{data.roles.includes("Trainer") && (
									<>
										<Separator />
										{trainingStatus?.status.value === "pending" ?
											<ProfileRow label={t("actions.requestTrainer.label")} value={t("actions.requestTrainer.pending")} />
										: trainingStatus?.status.value === "approved" ?
											<ProfileRow label={t("actions.requestTrainer.label")} value={t("actions.requestTrainer.approved")} disabled />
										: trainingStatus?.status.value === "rejected" ?
											<ProfileRow label={t("actions.requestTrainer.label")} value={t("actions.requestTrainer.rejected")} disabled />
										:	<ProfileAction label={t("actions.requestTrainer.request")} onPress={handleRequestTraining} />}
										{errorMessage && <Text className="text-destructive">{errorMessage}</Text>}
									</>
								)}
							</View>
						</View>
					:	null}
				</View>
			</ScrollView>
		</View>
	);
}
