import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function TrainingPlanDetailScreen() {
	const { id } = useLocalSearchParams<"/[locale]/plans/[id]">();

	console.log({ id });
	return (
		<View className="p-safe">
			<Text>This is the screen for a specific training plan</Text>
		</View>
	);
}
