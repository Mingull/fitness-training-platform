import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { NotificationItem as NotificationItemType } from "@fitness/contracts/notifications";
import { Pressable, View } from "react-native";
import { useFormatter } from "use-intl";
import { useMarkNotificationAsRead } from "../hooks/use-mark-notification-read";

export const NotificationItem = ({ item }: { item: NotificationItemType }) => {
	const markAsReadMutator = useMarkNotificationAsRead();
	const formatter = useFormatter();
	const isRead = Boolean(item.readAt);

	return (
		<Pressable
			key={item.id}
			disabled={isRead || markAsReadMutator.isPending}
			onPress={() => {
				if (!isRead) {
					markAsReadMutator.mutate({ notificationId: item.id });
				}
			}}
		>
			<Card className="py-4" pointerEvents={!isRead ? "none" : "auto"}>
				<CardHeader className="flex-row items-start justify-between gap-3">
					<View className="flex-1 gap-1">
						<CardTitle className="text-base font-semibold">{item.title}</CardTitle>
						<CardDescription className="text-muted-foreground text-sm leading-5">{item.message}</CardDescription>
					</View>
					<Badge variant="outline">
						<Text className={`text-xs font-medium ${isRead ? "text-muted-foreground" : "text-primary"}`}>{isRead ? "Read" : "Unread"}</Text>
					</Badge>
				</CardHeader>

				<CardContent className="pt-0">
					<Text className="text-muted-foreground text-xs">
						{formatter.dateTime(new Date(item.createdAt), {
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</Text>
				</CardContent>
			</Card>
		</Pressable>
	);
};
