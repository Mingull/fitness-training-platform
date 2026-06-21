import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { Dumbbell, UserX2 } from "lucide-react-native";
import { View } from "react-native";
import { useTranslations } from "use-intl";

type RequestsEmptyStateProps = {
	isLoading: boolean;
	error: { message?: string } | null;
	onRetry: () => void;
};

export function RequestsEmptyState({ isLoading, error, onRetry }: RequestsEmptyStateProps) {
	const t = useTranslations("requests.states");

	if (isLoading) {
		return (
			<View className="gap-3 pt-2">
				{Array.from({ length: 6 }, (_, index) => (
					<Card key={index} className="shadow-sm">
						<CardHeader className="flex-row items-start justify-between">
							<View className="flex-col gap-2">
								<Skeleton className="h-2 w-24 rounded-full" />
								<Skeleton className="h-3 w-28 rounded-full" />
								<Skeleton className="h-3 w-20 rounded-full" />
							</View>
							<View className="h-full flex-row items-center justify-center gap-2">
								<Skeleton className="h-7 w-18 rounded-full" />
								<Skeleton className="h-7 w-18 rounded-full" />
							</View>
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
				<EmptyContent className="gap-3">
					<Button onPress={onRetry} className="w-full">
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
					<Icon as={UserX2} size={18} />
				</EmptyMedia>
				<EmptyTitle>{t("empty.title")}</EmptyTitle>
				<EmptyDescription className="text-center">{t("empty.description")}</EmptyDescription>
			</EmptyHeader>
			<EmptyContent className="flex-row justify-center gap-2">
				<Button variant="outline" size="sm" onPress={onRetry} className="">
					<Text>{t("empty.refresh")}</Text>
				</Button>
			</EmptyContent>
		</Empty>
	);
}
