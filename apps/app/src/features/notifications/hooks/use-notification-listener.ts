import { EventSubscription } from "expo-modules-core";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "use-intl";

export function useNotificationListener() {
	const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
	const router = useRouter();
	const locale = useLocale();

	const notificationListener = useRef<EventSubscription | null>(null);
	const responseListener = useRef<EventSubscription | null>(null);

	useEffect(() => {
		notificationListener.current = Notifications.addNotificationReceivedListener((n) => {
			setNotification(n);
		});
		responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
			const _data = response.notification.request.content.data;

			router.push({
				pathname: "/[locale]/notifications",
				params: { locale },
			});

			// later: route based on _data.type
		});

		return () => {
			notificationListener.current?.remove();
			responseListener.current?.remove();
		};
	}, []);

	return notification;
}
