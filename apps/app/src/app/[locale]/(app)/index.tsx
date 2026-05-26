import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { useLocale } from "use-intl";

export default function Index() {
	const locale = useLocale();
	const router = useRouter();

	return (
		<View className="bg-background flex-1 items-center justify-center gap-2">
			<Text className="text-primary text-xl font-bold">Welcome to Nativewind!</Text>

			<View className="flex-row gap-4">
				<Button
					variant={"default"}
					onPress={() => {
						router.push({ pathname: "/[locale]/(app)/profile", params: { locale } });
					}}
				>
					<Text>Profile</Text>
				</Button>
			</View>
		</View>
	);
}
