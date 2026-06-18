import * as Notifications from "expo-notifications";
import { createContext, ReactNode, useContext } from "react";
import { useNotificationListener } from "../hooks/use-notification-listener";
import { usePushNotifications } from "../hooks/use-push-notifications";

type NotificationContext = {
	expoToken?: string;
	notification?: Notifications.Notification;
	error?: Error;
};

const NotificationContext = createContext<NotificationContext | undefined>(undefined);

export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error("useNotification must be used within a NotificationProvider");
	}
	return context;
};

type NotificationProviderProps = {
	children: ReactNode;
};

export function NotificationProvider({ children }: NotificationProviderProps) {
	const { expoToken, error } = usePushNotifications();
	const notification = useNotificationListener();

	return <NotificationContext.Provider value={{ expoToken, notification, error }}>{children}</NotificationContext.Provider>;
}
