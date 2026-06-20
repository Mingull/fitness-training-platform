import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { Dumbbell, Globe2 } from "lucide-react-native";
import { View } from "react-native";
import { useTranslations } from "use-intl";

type ExercisesEmptyStateProps = {
	isLoading: boolean;
	error: { message?: string } | null;
	onRetry: () => void;
};

export function ExercisesEmptyState({ isLoading, error, onRetry }: ExercisesEmptyStateProps) {
	const t = useTranslations("plans.workouts.exercises.list.states");

	if (isLoading) {
		return (
			<View className="flex-row gap-4">
				{Array.from({ length: 3 }, (_, index) => (
					<Card key={index} className="shadow-sm">
						<CardHeader>
							<Skeleton className="h-5 w-40" />
							<Skeleton className="h-4 w-full" />
						</CardHeader>
					</Card>
				))}
			</View>
		);
	}
	if (error) {
		return (
			<Empty className="border-destructive/40 border border-dashed">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Icon as={Dumbbell} size={18} className="text-destructive" />
					</EmptyMedia>
					<EmptyTitle className="text-xl">{t("error.title")}</EmptyTitle>
					<EmptyDescription className="leading-5">{error.message || t("error.description")}</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button variant="outline" onPress={onRetry}>
						<Text>{t("error.tryAgain")}</Text>
					</Button>
				</EmptyContent>
			</Empty>
		);
	}

	return (
		<Empty className="border-border border border-dashed">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Icon as={Globe2} size={18} />
				</EmptyMedia>
				<EmptyTitle>{t("empty.title")}</EmptyTitle>
				<EmptyDescription className="text-center">{t("empty.description")}</EmptyDescription>
			</EmptyHeader>
			<EmptyContent className="flex-row justify-center gap-2">
				<Button variant="outline" size="sm" onPress={onRetry}>
					<Text>{t("empty.refresh")}</Text>
				</Button>
			</EmptyContent>
		</Empty>
	);
}
