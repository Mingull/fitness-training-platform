import { useSession } from "@/features/auth/context";
import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import * as signalR from "@microsoft/signalr";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

type BadgeState = {
	unreadCount: number;
};

const buildHubUrls = () => {
	const baseUrl = process.env.EXPO_PUBLIC_SIGNALR_URL ?? process.env.EXPO_PUBLIC_API_URL;
	if (!baseUrl) {
		return [];
	}

	const normalized = baseUrl.replace(/\/+$/, "");
	const hubUrl = `${normalized}/hubs/notifications`;

	if (__DEV__ && hubUrl.startsWith("https://")) {
		return [hubUrl, hubUrl.replace("https://", "http://")];
	}

	return [hubUrl];
};

const createConnection = (hubUrl: string, accessTokenRef: React.RefObject<string | null>) => {
	return new signalR.HubConnectionBuilder()
		.withUrl(hubUrl, {
			accessTokenFactory: () => accessTokenRef.current ?? "",
		})
		.withAutomaticReconnect([0, 2000, 5000, 10000, 15000, 30000, 30000, 30000])
		.configureLogging({
			log(logLevel: signalR.LogLevel, message: string) {
				if (logLevel >= signalR.LogLevel.Warning) {
					console.warn("[SignalR]", message);
				}
			},
		})
		.build();
};

export function useNotificationSocket() {
	const { userId, isLoading, accessToken, accessTokenRef } = useSession();
	const { refresh } = useAuthActions();
	const queryClient = useQueryClient();
	const connectionRef = useRef<signalR.HubConnection | null>(null);
	const { unreadCount } = useNotifications();

	const [badge, setBadge] = useState<BadgeState>({
		unreadCount: 0,
	});

	useEffect(() => {
		if (!userId) return;
		setBadge({ unreadCount });
	}, [unreadCount, userId]);

	useEffect(() => {
		if (isLoading || !userId || !accessToken) return;

		const subscription = AppState.addEventListener("change", (nextState) => {
			if (nextState === "active") {
				queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
			}
		});

		return () => {
			subscription.remove();
		};
	}, [accessToken, isLoading, queryClient, userId]);

	useEffect(() => {
		if (isLoading || !userId) return;

		if (!accessToken) {
			refresh();
			return;
		}

		const hubUrls = buildHubUrls();
		if (!hubUrls.length) return;

		const connection = createConnection(hubUrls[0], accessTokenRef);

		connectionRef.current = connection;

		connection.onclose((error) => {
			if (error) {
				console.warn("[SignalR] Connection closed with error:", error.message);
			}
		});

		const invalidateNotifications = () => {
			void queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
		};

		connection.on("notification_badge", invalidateNotifications);
		connection.on("notification_created", invalidateNotifications);
		connection.on("notification", invalidateNotifications);

		connection.onreconnected(() => {
			void connection.invoke("Register", userId).catch(console.error);
			invalidateNotifications();
		});

		(async () => {
			try {
				await connection.start();
				await connection.invoke("Register", userId);
			} catch (error) {
				console.error(error);
			}
		})();

		return () => {
			const currentConnection = connectionRef.current;
			currentConnection?.off("notification_badge");
			currentConnection?.off("notification_created");
			currentConnection?.off("notification");
			void currentConnection?.stop();
		};
	}, [accessToken, accessTokenRef, isLoading, queryClient, refresh, userId]);

	return badge;
}
