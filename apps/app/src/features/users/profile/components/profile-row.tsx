import { Text } from "@/components/ui/text";
import { View } from "react-native";

export function ProfileRow({ label, value, vertical, disabled }: { label: string; value?: string; vertical?: boolean; disabled?: boolean }) {
	if (!value) return null;

	return (
		<View className={vertical ? "flex-col gap-1 py-2" : "flex-row justify-between py-1"}>
			<Text className="text-muted-foreground">{label}</Text>
			<Text className={disabled ? "text-muted-foreground font-medium" : "text-foreground font-medium"}>{value}</Text>
		</View>
	);
}
