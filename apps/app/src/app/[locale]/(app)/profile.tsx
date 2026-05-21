import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useSession } from "@/features/auth/context";
import { useProfile } from "@/hooks/use-profile";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ChevronLeft, Pencil } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Profile() {
	const router = useRouter();
	const { bottom } = useSafeAreaInsets();
	const { data, isLoading, error } = useProfile();
	const { signOut } = useSession();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editFormData, setEditFormData] = useState({
		firstName: data?.firstName || "",
		lastName: data?.lastName || "",
		bio: data?.bio || "",
		goals: data?.goals || "",
		experienceLevel: data?.experienceLevel || "",
	});

	return (
		<View className="bg-primary flex-1">
			<SafeAreaView className="flex-1">
				<View className="relative mt-2 items-center">
					<Button variant="ghost" size="icon" className="absolute top-0 left-0" onPress={() => router.back()}>
						<Icon as={ChevronLeft} size={14 * 1.5} strokeWidth={3} />
					</Button>
					<Text className="text-foreground text-center text-lg font-medium">{isLoading ? "Loading..." : "Profile"}</Text>
				</View>
				<View className="h-full">
					{isLoading ?
						<View className="flex-1">
							<View className="items-center pt-6 pb-6">
								{/* Profile Picture and Name */}
								<Skeleton className="size-32 rounded-full" />
								<Skeleton className="mt-3 h-6 w-40" />
								<Skeleton className="mt-1 h-4 w-24" />
							</View>
							{/* Profile Details */}
							{/* <View className="bg-card flex-1 gap-2 rounded-4xl p-6 mt-6 h-full shadow-sm"> */}
							<View className="bg-card flex-1 gap-2 rounded-4xl p-6 shadow-sm" style={{ paddingBottom: 1.2 * bottom }}>
								{/* Info Rows */}
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-8 w-full" />

								<Separator />
								{/* Actions */}
								<View className="mt-auto gap-2">
									<Skeleton className="h-10 w-full" />
									<Skeleton className="h-10 w-full" />
								</View>
							</View>
						</View>
					: data ?
						<View className="flex-1">
							<View className="items-center pt-6 pb-6">
								<View className="relative">
									{data.pictureUrl ?
										<Image source={{ uri: data.pictureUrl }} className="border-background h-28 w-28 rounded-full border-4" />
									:	<View className="size-32 items-center justify-center rounded-full bg-white/20">
											<Text className="text-2xl font-bold text-white">{(data.firstName?.[0] || "") + (data.lastName?.[0] || "")}</Text>
										</View>
									}

									<Button onPress={() => setIsEditModalOpen(true)} variant="secondary" size="icon-sm" className="absolute right-0 bottom-0">
										<Icon as={Pencil} />
									</Button>
								</View>

								<Text className="mt-3 text-xl font-semibold text-white">
									{data.firstName} {data.lastName}
								</Text>
								<Text className="text-sm text-white/80">@{data.username}</Text>
							</View>

							<View className="bg-card flex-1 gap-2 rounded-4xl p-6 shadow-sm" style={{ paddingBottom: 1.1 * bottom }}>
								<ProfileRow label="Email" value={data.email} />
								<ProfileRow label="Role" value={data.roles[0]} />
								<ProfileRow label="Experience" value={data.experienceLevel ?? "Not specified"} />
								<ProfileRow label="Goals" value={data.goals ?? "No goals set"} />
								<ProfileRow label="Bio" value={data.bio ?? "No bio set"} />
								<Separator />

								<View className="mt-auto">
									<ProfileAction label="Edit Profile" onPress={() => setIsEditModalOpen(true)} />
									<ProfileAction label="Sign Out" onPress={signOut} destructive />
								</View>
							</View>
						</View>
					:	null}
				</View>
			</SafeAreaView>
		</View>
	);
}

function ProfileRow({ label, value }: { label: string; value?: string }) {
	if (!value) return null;

	return (
		<View className="flex-row justify-between py-3">
			<Text className="text-muted-foreground">{label}</Text>
			<Text className="text-foreground font-medium">{value}</Text>
		</View>
	);
}

function ProfileAction({ label, onPress, destructive }: { label: string; onPress: () => void; destructive?: boolean }) {
	return (
		<Pressable onPress={onPress} className="flex-row items-center justify-between py-3">
			<Text className={destructive ? "text-destructive" : "text-foreground"}>{label}</Text>
			<Text className="text-muted-foreground">›</Text>
		</Pressable>
	);
}

function ErrorState({ error }: { error: Error }) {
	return (
		<View className="flex-1 items-center justify-center px-6">
			<Text className="text-destructive text-center">{error.message || "Failed to load profile."}</Text>
		</View>
	);
}

function EditModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
	return (
		<Modal visible={isOpen} animationType="slide" transparent onRequestClose={onClose}>
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<View className="flex-1 bg-black/50">
					<View className="bg-background mt-12 flex-1 rounded-t-3xl px-6 py-6">
						<ScrollView contentContainerClassName="gap-4 pb-6">
							<View className="mb-4 flex-row items-center justify-between">
								<Text className="text-foreground text-xl font-bold">Edit Profile</Text>
								<Pressable onPress={onClose}>
									<Text className="text-primary text-lg">✕</Text>
								</Pressable>
							</View>
							{/* <View className="gap-1">
							<Text className="text-muted-foreground text-xs font-medium uppercase">First Name</Text>
							<Input
								value={editFormData.firstName}
								onChangeText={(value) => setEditFormData((prev) => ({ ...prev, firstName: value }))}
								placeholder="Enter first name"
							/>
						</View>
						<View className="gap-1">
							<Text className="text-muted-foreground text-xs font-medium uppercase">Last Name</Text>
							<Input
								value={editFormData.lastName}
								onChangeText={(value) => setEditFormData((prev) => ({ ...prev, lastName: value }))}
								placeholder="Enter last name"
							/>
						</View>
						<View className="gap-1">
							<Text className="text-muted-foreground text-xs font-medium uppercase">Bio</Text>
							<Textarea
								value={editFormData.bio || ""}
								onChangeText={(value) => setEditFormData((prev) => ({ ...prev, bio: value }))}
								placeholder="Tell us about yourself"
							/>
						</View>
						<View className="gap-1">
							<Text className="text-muted-foreground text-xs font-medium uppercase">Goals</Text>
							<Textarea
								value={editFormData.goals || ""}
								onChangeText={(value) => setEditFormData((prev) => ({ ...prev, goals: value }))}
								placeholder="What are your fitness goals?"
							/>
						</View>
						<View className="gap-1">
							<Text className="text-muted-foreground text-xs font-medium uppercase">Experience Level</Text>
							<Input
								value={editFormData.experienceLevel || ""}
								onChangeText={(value) => setEditFormData((prev) => ({ ...prev, experienceLevel: value }))}
								placeholder="e.g., Beginner, Intermediate, Advanced"
							/>
						</View>
						<View className="mt-6 gap-3">
							<Button onPress={() => setIsEditModalOpen(false)}>
								<Text>Save Changes</Text>
							</Button>
							<Button variant="outline" onPress={() => setIsEditModalOpen(false)}>
								<Text>Cancel</Text>
							</Button>
						</View> */}
						</ScrollView>
					</View>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
}
