import { Scaffold, ScaffoldDescription, ScaffoldHeader, ScaffoldTitle } from "@/components/ui/scaffold";
import { RequestsEmptyState } from "@/features/trainer-requests/components/request-empty-state";
import { RequestItem } from "@/features/trainer-requests/components/request-item";
import { useReplyRequestTrainer } from "@/features/trainer-requests/hooks/use-reply-trainer-request";
import { useTrainerRequests } from "@/features/trainer-requests/hooks/use-trainer-requests";
import { FlatList, View } from "react-native";
import { useTranslations } from "use-intl";

export default function TrainerRequestScreen() {
	const t = useTranslations("requests");
	const {
		data: trainerRequests,
		isLoading: isLoadingTrainerRequests,
		error: trainerRequestsError,
		isRefetching: isRefetchingTrainerRequests,
		refetch: refetchTrainerRequests,
	} = useTrainerRequests();
	const mutator = useReplyRequestTrainer();

	return (
		<Scaffold>
			<ScaffoldHeader>
				<View className="items-start justify-between gap-1">
					<ScaffoldTitle>{t("header.title")}</ScaffoldTitle>
					<ScaffoldDescription>{t("header.description")}</ScaffoldDescription>
				</View>
			</ScaffoldHeader>
			<FlatList
				data={trainerRequests}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<RequestItem
						item={item}
						onAccept={async () => {
							try {
								await mutator.mutateAsync({ reply: "accept", requestId: item.id, requesterId: item.sporter.id });
							} catch (error) {
								// Handle error, e.g. show a toast notification
							}
						}}
						onReject={async () => {
							try {
								await mutator.mutateAsync({ reply: "reject", requestId: item.id, requesterId: item.sporter.id });
							} catch (error) {
								// Handle error, e.g. show a toast notification
							}
						}}
					/>
				)}
				refreshing={isRefetchingTrainerRequests}
				onRefresh={refetchTrainerRequests}
				contentContainerClassName="px-4"
				ListEmptyComponent={<RequestsEmptyState isLoading={isLoadingTrainerRequests} error={trainerRequestsError} onRetry={refetchTrainerRequests} />}
			/>
		</Scaffold>
	);
}
