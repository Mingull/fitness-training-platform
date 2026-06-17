import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { TrainingPlanItem } from "@fitness/contracts/training-plans";
import { Link } from "expo-router";
import { ChevronRight, Clock3, FlameIcon, Globe2, UserRound } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { useFormatter, useLocale, useTranslations } from "use-intl";

export const PlanItem = ({ item, authorId }: { item: TrainingPlanItem; authorId?: string | null }) => {
	const locale = useLocale();
	const formatter = useFormatter();
	const t = useTranslations("plans.item");
	const updatedAt = item.updatedAt ?? item.createdAt;

	return (
		<Link href={{ pathname: "/[locale]/plans/[planId]", params: { locale, planId: item.id } }} asChild>
			<Pressable accessibilityRole="link" className="cursor-pointer active:opacity-90">
				<Card pointerEvents="none" className="py-4">
					<CardHeader className="flex-row items-start gap-3">
						<View className="bg-primary/10 mt-0.5 size-11 items-center justify-center rounded-full">
							<Text className="text-primary text-base font-bold">{item.name.trim().charAt(0).toUpperCase()}</Text>
						</View>

						<View className="flex-1 gap-1">
							<View className="flex-row items-center justify-between gap-2">
								<CardTitle className="text-lg leading-6 font-semibold">{item.name}</CardTitle>
							</View>
							<CardDescription numberOfLines={2} className="text-sm leading-5">
								{item.description}
							</CardDescription>
						</View>

						<Icon as={ChevronRight} size={18} className="text-muted-foreground mt-1" />
					</CardHeader>

					<CardContent className="flex-row flex-wrap gap-2">
						<Badge variant="muted">
							<Icon as={Clock3} size={12} />
							<Text>{t("meta.duration", { minutes: item.estimatedDuration })}</Text>
						</Badge>

						<Badge variant="muted">
							<Icon as={FlameIcon} size={12} />
							<Text>{item.difficulty.level}</Text>
							<Text>{t(`meta.difficulty.${item.difficulty.label}`)}</Text>
						</Badge>

						<Badge>
							<Icon as={Globe2} size={12} />
							<Text>{item.isPublic ? t("meta.visibility.public") : t("meta.visibility.private")}</Text>
						</Badge>
					</CardContent>

					<CardFooter className="px-4 pt-0">
						<View className="w-full flex-row flex-wrap items-center gap-2">
							<Badge variant="muted">
								<Icon as={UserRound} size={12} />
								<Text>{item.creator.id === authorId ? t("meta.you") : item.creator.username}</Text>
							</Badge>
							<Text className="text-muted-foreground text-xs">
								{item.updatedAt ?
									t("meta.updated", { date: new Date(item.updatedAt) })
								:	t("meta.created", { date: new Date(item.createdAt) })}
							</Text>
						</View>
					</CardFooter>
				</Card>
			</Pressable>
		</Link>
	);
};
