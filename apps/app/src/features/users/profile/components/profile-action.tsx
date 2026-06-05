import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { ChevronRight } from "lucide-react-native";
import { Pressable } from "react-native";

export function ProfileAction({ label, onPress, destructive }: { label: string; onPress: () => void; destructive?: boolean }) {
	return (
		<Pressable onPress={onPress} className="flex-row items-center justify-between py-3">
			<Text className={destructive ? "text-destructive" : "text-foreground"}>{label}</Text>
			<Text className="text-muted-foreground">
				<Icon as={ChevronRight} size={14 * 1.5} />
			</Text>
		</Pressable>
	);
}
