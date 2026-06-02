import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";
import { ProfileAction } from "@/features/profile/components/profile-action";
import { EditProfileModal } from "@/features/profile/components/profile-edit-modal";
import { ProfileRow } from "@/features/profile/components/profile-row";
import { useProfile } from "@/features/profile/hooks/use-profile";
import { cn } from "@fitness/ui/lib/utils";
import { useRouter } from "expo-router";
import { ChevronLeft, Pencil, XIcon } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { useLocale, useTranslations } from "use-intl";

export default function ProfileScreen() {
	const router = useRouter();
	const locale = useLocale();
	const t = useTranslations("profile");
	const { data, isLoading, error, isRefetching, refetch } = useProfile();
	const { signOut } = useAuthActions();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	return (
		<View className="bg-primary pt-safe flex-1">
			<ScrollView className="flex-1" contentContainerClassName="grow" refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}>
				<View className="mt-2 flex-row items-center justify-between px-4">
					<Button variant="ghost" size="icon" onPress={() => router.back()}>
						<Icon as={ChevronLeft} size={14 * 1.5} strokeWidth={3} className="text-primary-foreground" />
					</Button>
					<Text className="text-primary-foreground text-center text-lg font-medium">{isLoading ? t("title.loading") : t("title.label")}</Text>
					<Button
						onPress={() => setIsEditModalOpen(true)}
						variant="accent"
						size="icon-sm"
						className={cn({ "opacity-0": isLoading || !!error })}
						disabled={isLoading || !!error}
					>
						<Icon as={Pencil} />
					</Button>
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

								<Text className="text-destructive mt-3 text-xl font-semibold">{error.message || t("title.failed")}</Text>
								<Text className="text-sm text-white/80">{t("tryAgain")}</Text>
							</View>

							<View className="bg-card flex-1 gap-2 rounded-4xl p-6 shadow-sm">
								<ProfileAction
									label={t("actions.retry")}
									onPress={() => router.replace({ pathname: "/[locale]/(app)/profile", params: { locale } })}
								/>
								<ProfileAction label={t("actions.signOut")} onPress={signOut} destructive />
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
								<ProfileRow label={t("rows.email.label")} value={data.email} />
								<ProfileRow label={t("rows.role.label")} value={data.roles[0]} />
								<ProfileRow label={t("rows.experience.label")} value={t(`rows.experience.options.${data.experienceLevel}`)} />
								<ProfileRow label={t("rows.goals.label")} value={data.goals ?? t("rows.goals.empty")} vertical />
								<ProfileRow label={t("rows.bio.label")} value={data.bio ?? t("rows.bio.empty")} vertical />
								<Separator />

								<View className="">
									<ProfileAction label={t("actions.editProfile")} onPress={() => setIsEditModalOpen(true)} />
									<ProfileAction label={t("actions.signOut")} onPress={signOut} destructive />
								</View>
							</View>
						</View>
					:	null}
				</View>
			</ScrollView>
			{!isLoading && data ?
				<EditProfileModal
					isOpen={isEditModalOpen}
					onClose={() => setIsEditModalOpen(false)}
					defaultValues={{
						firstName: data.firstName,
						lastName: data.lastName,
						experienceLevel: data.experienceLevel,
						bio: data.bio,
						goals: data.goals,
						pictureUrl: data.pictureUrl,
					}}
				/>
			:	null}
		</View>
	);
}
