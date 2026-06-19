import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { AlertCircle, BellOff } from "lucide-react-native";
import { View } from "react-native";
import { useTranslations } from "use-intl";

type NotificationsEmptyStateProps = {
	isLoading: boolean;
	error: { message?: string } | null;
	onRetry: () => void;
};

export function NotificationsEmptyState({ isLoading, error, onRetry }: NotificationsEmptyStateProps) {
	const t = useTranslations("notifications.states");

	if (isLoading) {
		return (
			<View className="gap-3 pt-2">
				{Array.from({ length: 3 }, (_, index) => (
					<Card key={index} className="shadow-sm">
						<CardHeader className="items-start">
							<View className="flex-row items-start gap-3">
								<View className="flex-1 gap-2">
									<Skeleton className="h-5 w-40" />
									<Skeleton className="h-4 w-full" />
								</View>
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
						{/* need better icon for error state */}
						<Icon as={AlertCircle} size={18} className="text-destructive" />
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
					{/* need better icon for no notifications */}
					<Icon as={BellOff} size={18} />
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
	);
}
