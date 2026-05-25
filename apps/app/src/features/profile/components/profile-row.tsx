import { Text } from "@/components/ui/text";
import { View } from "react-native";

export function ProfileRow({ label, value, vertical }: { label: string; value?: string; vertical?: boolean }) {
	if (!value) return null;

	return (
		<View className={vertical ? "flex-col gap-1 py-2" : "flex-row justify-between py-1"}>
			<Text className="text-muted-foreground">{label}</Text>
			<Text className="text-foreground font-medium">{value}</Text>
		</View>
	);
}
