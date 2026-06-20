import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Exercise } from "@fitness/contracts/exercises";
import { Menu } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

/**
 * Component to display an exercise item in the training plan workout screen.
 */
export const ExerciseItem = ({ item, drag, isDragEnabled = false }: { item: Exercise["data"]; drag?: () => void; isDragEnabled?: boolean }) => {
	const initials = item.name.trim().charAt(0).toUpperCase();
	const weightLabel = Number.isInteger(item.weight) ? `${item.weight} kg` : `${item.weight.toFixed(1)} kg`;
	const totalVolume = item.sets * item.reps * item.weight;
	const totalVolumeLabel = Number.isInteger(totalVolume) ? totalVolume.toString() : totalVolume.toFixed(1);

	return (
		<Card className="py-4">
			<CardHeader className="flex-row items-start gap-3">
				{isDragEnabled && drag && (
					<TouchableOpacity onLongPress={drag} delayLongPress={100} hitSlop={8} className="mt-1">
						<Icon as={Menu} className="text-muted-foreground" />
					</TouchableOpacity>
				)}

				<View className="bg-primary/10 mt-0.5 size-11 items-center justify-center rounded-full">
					<Text className="text-primary text-base font-bold">{initials}</Text>
				</View>

				<View className="flex-1 gap-1">
					<View className="flex-row items-center justify-between gap-2">
						<CardTitle className="text-base font-semibold">{item.name}</CardTitle>
						<Text className="text-muted-foreground text-xs font-medium">#{item.order}</Text>
					</View>
					<CardDescription numberOfLines={2} className="leading-5">
						{item.description}
					</CardDescription>
				</View>
			</CardHeader>

			<CardContent className="gap-3">
				<View className="bg-muted/40 border-border/70 flex-row overflow-hidden rounded-xl border">
					<View className="flex-1 items-center py-3">
						<Text className="text-muted-foreground text-[10px] font-semibold uppercase">Sets</Text>
						<Text className="text-foreground text-lg font-extrabold">{item.sets}</Text>
					</View>

					<View className="bg-border/70 w-px" />

					<View className="flex-1 items-center py-3">
						<Text className="text-muted-foreground text-[10px] font-semibold uppercase">Reps</Text>
						<Text className="text-foreground text-lg font-extrabold">{item.reps}</Text>
					</View>

					<View className="bg-border/70 w-px" />

					<View className="flex-1 items-center py-3">
						<Text className="text-muted-foreground text-[10px] font-semibold uppercase">Weight</Text>
						<Text className="text-primary text-lg font-extrabold">{weightLabel}</Text>
					</View>
				</View>

				<View className="bg-primary/10 border-primary/20 flex-row items-center justify-between rounded-lg border px-3 py-2">
					<Text className="text-muted-foreground text-xs font-medium">Planned volume</Text>
					<Text className="text-primary text-sm font-bold">{totalVolumeLabel} kg</Text>
				</View>
			</CardContent>
		</Card>
	);
};
