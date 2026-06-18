import { Scaffold, ScaffoldDescription, ScaffoldHeader, ScaffoldTitle } from "@/components/ui/scaffold";
import { NotificationItem } from "@/features/notifications/components/notification-item";
import { NotificationsEmptyState } from "@/features/notifications/components/notifications-empty-state";
import { useNotificationSocket } from "@/features/notifications/hooks/use-notification-socket";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { useEffect } from "react";
import { FlatList, View } from "react-native";
import { useTranslations } from "use-intl";

export default function NotificationsScreen() {
	const { data: notifications, isLoading, isRefetching, refetch, error } = useNotifications();
	const { unreadCount } = useNotificationSocket();
	const t = useTranslations("notifications");

	useEffect(() => {
		if (unreadCount > 0) {
			refetch();
		}
	}, [unreadCount, refetch]);

	return (
		<Scaffold>
			<ScaffoldHeader>
				<View className="items-start justify-between gap-1">
					<ScaffoldTitle>{t("header.title")}</ScaffoldTitle>
					<ScaffoldDescription>{t("header.description")}</ScaffoldDescription>
				</View>
			</ScaffoldHeader>
			<FlatList
				data={notifications}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <NotificationItem item={item} />}
				refreshing={isRefetching}
				onRefresh={refetch}
				contentContainerClassName="px-4 pb-24 gap-4"
				ListEmptyComponent={<NotificationsEmptyState isLoading={isLoading} error={error} onRetry={refetch} />}
				showsVerticalScrollIndicator={false}
			/>
		</Scaffold>
	);
}
