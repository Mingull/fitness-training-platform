import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { TrainingPlanItemData } from "@fitness/contracts/training-plans";
import { Link } from "expo-router";
import { ChevronRight, Clock3, Globe2, UserRound } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { useLocale } from "use-intl";

export const PlanItem = ({ item, authorId }: { item: TrainingPlanItemData; authorId?: string | null }) => {
	const locale = useLocale();

	return (
		<Link href={{ pathname: "/[locale]/plans/[id]", params: { locale, id: item.id } }} asChild>
			<Pressable className="active:opacity-90">
				<Card className="shadow-sm">
					<CardHeader className="flex-row items-start gap-3">
						<View className="bg-primary/10 mt-0.5 size-11 items-center justify-center rounded-full">
							<Text className="text-primary text-base font-bold">{item.name.trim().charAt(0).toUpperCase()}</Text>
						</View>

						<View className="flex-1 gap-1">
							<CardTitle className="text-lg">{item.name}</CardTitle>
							<CardDescription numberOfLines={2} className="leading-5">
								{item.description}
							</CardDescription>
						</View>

						<Icon as={ChevronRight} size={18} className="text-muted-foreground mt-1" />
					</CardHeader>

					<CardContent className="flex-row flex-wrap gap-2">
						<Badge variant="muted">
							<Icon as={Clock3} size={12} />
							<Text>{item.estimatedDuration} min</Text>
						</Badge>

						<Badge variant="muted">
							<Icon as={UserRound} size={12} />
							<Text>{item.creator.id === authorId ? "You" : item.creator.username}</Text>
						</Badge>

						<Badge>
							<Icon as={Globe2} size={12} />
							<Text>{item.isPublic ? "Public" : "Private"}</Text>
						</Badge>
					</CardContent>
				</Card>
			</Pressable>
		</Link>
	);
};
