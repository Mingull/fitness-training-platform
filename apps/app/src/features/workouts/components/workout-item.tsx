import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { type WorkoutItem as WorkoutItemType } from "@fitness/contracts/workouts";
import { Link } from "expo-router";
import { ChevronRight, Menu } from "lucide-react-native";
import { Pressable, TouchableOpacity, View } from "react-native";
import { useLocale } from "use-intl";

export const WorkoutItem = ({
	item,
	planId,
	drag,
	isDragEnabled = false,
}: {
	item: WorkoutItemType;
	planId: string;
	drag?: () => void;
	isDragEnabled?: boolean;
}) => {
	const locale = useLocale();

	return (
		<Link href={{ pathname: "/[locale]/plans/[planId]/workouts/[workoutId]", params: { locale, planId, workoutId: item.id } }} asChild>
			<Pressable accessibilityRole="link" className="cursor-pointer active:opacity-90">
				<Card pointerEvents="box-none" className="py-4">
					<CardHeader className="flex-row items-start gap-3">
						{isDragEnabled && drag && (
							<TouchableOpacity onLongPress={drag} delayLongPress={100} hitSlop={8} className="mt-1">
								<Icon as={Menu} className="text-muted-foreground" />
							</TouchableOpacity>
						)}

						<View className="bg-primary/10 mt-0.5 size-11 items-center justify-center rounded-full">
							<Text className="text-primary text-base font-bold">{item.order}</Text>
						</View>

						<View className="flex-1 gap-1">
							<View className="flex-row items-center justify-between gap-2">
								<CardTitle className="text-base font-semibold">{item.name}</CardTitle>
								<Badge variant="muted">
									<Text className="text-xs font-medium">Workout #{item.order}</Text>
								</Badge>
							</View>
							<Text className="text-muted-foreground text-sm">Open workout and manage exercises</Text>
						</View>

						<Icon as={ChevronRight} className="text-muted-foreground mt-1" size={14 * 1.5} />
					</CardHeader>

					<CardContent className="pt-0">
						<View className="border-border/70 bg-muted/30 flex-row items-center justify-between rounded-lg border px-3 py-2">
							<Text className="text-muted-foreground text-xs">Tap to view exercise details</Text>
							{isDragEnabled && <Text className="text-muted-foreground text-xs font-medium">Hold icon to reorder</Text>}
						</View>
					</CardContent>
				</Card>
			</Pressable>
		</Link>
	);
};
