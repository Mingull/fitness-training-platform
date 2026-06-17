import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Dumbbell, Globe2 } from "lucide-react-native";
import { useTranslations } from "use-intl";

type WorkoutsEmptyStateProps = {
	isOwner: boolean;
	error: { message?: string } | null;
	onRetry: () => void;
	onCreate: () => void;
};

export function WorkoutsEmptyState({ isOwner, error, onRetry, onCreate }: WorkoutsEmptyStateProps) {
	const t = useTranslations("plans.workouts.list.states");

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
				{isOwner && (
					<Button variant="default" onPress={onCreate}>
						<Text>{t("empty.create")}</Text>
					</Button>
				)}
				<Button variant="outline" size="sm" onPress={onRetry}>
					<Text>{t("empty.refresh")}</Text>
				</Button>
			</EmptyContent>
		</Empty>
	);
}
