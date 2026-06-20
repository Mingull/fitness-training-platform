import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { type ProfileItem as ProfileItemType } from "@fitness/contracts/user";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { useLocale } from "use-intl";

export const ProfileItem = ({ item, orientation }: { item: ProfileItemType; orientation: "horizontal" | "vertical" }) => {
	const locale = useLocale();
	const router = useRouter();

	return (
		<Pressable
			accessibilityRole="link"
			className="cursor-pointer active:opacity-90"
			onPress={() => router.push({ pathname: "/[locale]/(app)/explore/[profileId]", params: { locale, profileId: item.userId } })}
		>
			<Card className="py-4" pointerEvents="none">
				<CardHeader className={orientation === "horizontal" ? "flex-col" : "flex-row"}>
					<Avatar alt={`@${item.username}`} className="border-background size-36 rounded-3xl">
						<AvatarImage source={{ uri: item.pictureUrl }} />
						<AvatarFallback className="bg-muted rounded-3xl">
							<Text className="text-muted-foreground font-mono text-3xl">{item.firstName.charAt(0) + item.lastName.charAt(0)}</Text>
						</AvatarFallback>
					</Avatar>
					<View className="items-center gap-0">
						<Text className="text-muted-foreground text-center font-mono text-xs">@{item.username}</Text>
						<CardTitle>
							{item.firstName} {item.lastName}
						</CardTitle>
						<CardDescription>{item.roles.includes("Trainer") ? "Trainer" : "Sporter"}</CardDescription>
					</View>
				</CardHeader>
			</Card>
		</Pressable>
	);
};
