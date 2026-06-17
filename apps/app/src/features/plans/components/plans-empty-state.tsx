import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { Dumbbell, Globe2 } from "lucide-react-native";
import { View } from "react-native";
import { useTranslations } from "use-intl";

type PlansEmptyStateProps = {
	isLoading: boolean;
	error: { message?: string } | null;
	onCreate: () => void;
	onRetry: () => void;
};

export function PlansEmptyState({ isLoading, error, onCreate, onRetry }: PlansEmptyStateProps) {
	const t = useTranslations("plans.list.states");

	if (isLoading) {
		return (
			<View className="gap-3 pt-2">
				{Array.from({ length: 3 }, (_, index) => (
					<Card key={index} className="shadow-sm">
						<CardHeader className="items-start pb-4">
							<View className="flex-row items-start gap-3">
								<Skeleton className="mt-0.5 size-11 rounded-full" />
								<View className="flex-1 gap-2">
									<Skeleton className="h-5 w-40" />
									<Skeleton className="h-4 w-full" />
								</View>
							</View>
						</CardHeader>
						<CardContent className="flex-row flex-wrap gap-2">
							<Skeleton className="h-7 w-24 rounded-full" />
							<Skeleton className="h-7 w-28 rounded-full" />
							<Skeleton className="h-7 w-20 rounded-full" />
						</CardContent>
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
					<Icon as={Globe2} size={18} />
				</EmptyMedia>
				<EmptyTitle>{t("empty.title")}</EmptyTitle>
				<EmptyDescription>{t("empty.description")}</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button variant="default" onPress={onCreate}>
					<Text>{t("empty.create")}</Text>
				</Button>
				<Button variant="outline" size="sm" onPress={onRetry} className="">
					<Text>{t("empty.refresh")}</Text>
				</Button>
			</EmptyContent>
		</Empty>
	);
}
