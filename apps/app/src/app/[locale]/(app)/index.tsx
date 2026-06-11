import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { toast } from "sonner-native";

export default function HomeScreen() {
	return (
		<View className="bg-background flex-1 items-center justify-center gap-2">
			<Text className="text-primary text-xl font-bold">Welcome to Nativewind!</Text>

			<View className="flex-row gap-4">
				<Button
					variant={"default"}
					onPress={() => {
						toast.success("Navigating to profile...");
					}}
				>
					<Text>Profile</Text>
				</Button>
			</View>
		</View>
	);
}
