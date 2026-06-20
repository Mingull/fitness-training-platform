import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { Dumbbell } from "lucide-react-native";
import { View } from "react-native";
import { useTranslations } from "use-intl";

type ProfilesEmptyStateProps = {
	isLoading: boolean;
	error: { message?: string } | null;
	onRetry: () => void;
};

export function ProfilesEmptyState({ isLoading, error, onRetry }: ProfilesEmptyStateProps) {
	const t = useTranslations("profiles.states");

	if (isLoading) {
		return (
			<View className="flex-row gap-4">
				{Array.from({ length: 3 }, (_, index) => (
					<Card key={index} className="shadow-sm">
						<CardHeader className="flex-col">
							<Skeleton className="size-32 rounded-3xl" />
							<Skeleton className="h-3 w-20 rounded-full" />
							<Skeleton className="h-4 w-28 rounded-full" />
							<Skeleton className="h-3 w-16 rounded-full" />
						</CardHeader>
					</Card>
				))}
			</View>
		);
	}

	if (error) {
		return (
			<View className="flex-row">
				<Empty className="border-destructive/40 border border-dashed">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Icon as={Dumbbell} size={18} className="text-destructive" />
						</EmptyMedia>
						<EmptyTitle className="text-xl">{t("error.title")}</EmptyTitle>
						<EmptyDescription className="leading-5">{error.message || t("error.description")}</EmptyDescription>
					</EmptyHeader>
					<EmptyContent className="gap-3">
						<Button onPress={onRetry} className="w-full">
							<Text>{t("error.tryAgain")}</Text>
						</Button>
					</EmptyContent>
				</Empty>
			</View>
		);
	}

	return (
		<View className="flex-row">
			<Empty className="border-border border border-dashed">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Icon as={Dumbbell} size={18} />
					</EmptyMedia>
					<EmptyTitle>{t("empty.title")}</EmptyTitle>
					<EmptyDescription>{t("empty.description")}</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button variant="outline" size="sm" onPress={onRetry} className="">
						<Text>{t("empty.refresh")}</Text>
					</Button>
				</EmptyContent>
			</Empty>
		</View>
	);
}
