import { useSession } from "@/features/auth/context";
import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { useIsMounted } from "@/hooks/use-is-mounted";
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
	const isMounted = useIsMounted();
	const { userId, isLoading, accessToken, accessTokenRef } = useSession();
	const { refresh } = useAuthActions();
	const queryClient = useQueryClient();
	const connectionRef = useRef<signalR.HubConnection | null>(null);
	const refreshInFlightRef = useRef(false);
	const { unreadCount } = useNotifications();

	const [badge, setBadge] = useState<BadgeState>({
		unreadCount: 0,
	});

	useEffect(() => {
		if (!userId) return;
		setBadge({ unreadCount });
	}, [unreadCount, userId]);

	useEffect(() => {
		if (!userId) return;

		const subscription = AppState.addEventListener("change", (nextState) => {
			if (nextState === "active") {
				queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
			}
		});

		return () => {
			subscription.remove();
		};
	}, [queryClient, userId]);

	useEffect(() => {
		if (isLoading || !userId) return;

		if (accessToken) {
			refreshInFlightRef.current = false;
			return;
		}

		if (refreshInFlightRef.current) {
			return;
		}

		refreshInFlightRef.current = true;
		void refresh().finally(() => {
			refreshInFlightRef.current = false;
		});
	}, [accessToken, isLoading, refresh, userId]);

	useEffect(() => {
		if (!isMounted) return;
		if (isLoading || !userId || !accessToken) return;

		const existingConnection = connectionRef.current;
		if (
			existingConnection &&
			(existingConnection.state === signalR.HubConnectionState.Connected ||
				existingConnection.state === signalR.HubConnectionState.Connecting ||
				existingConnection.state === signalR.HubConnectionState.Reconnecting)
		) {
			return;
		}

		const hubUrls = buildHubUrls();
		if (!hubUrls.length) return;

		const connection = createConnection(hubUrls[0], accessTokenRef);
		let disposed = false;

		connectionRef.current = connection;

		connection.onclose((error) => {
			if (error) {
				console.warn("[SignalR] Connection closed with error:", error.message);
			}
		});

		const invalidateNotifications = () => {
			queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
		};

		connection.on("notification_badge", invalidateNotifications);
		connection.on("notification_created", invalidateNotifications);
		connection.on("notification", invalidateNotifications);

		connection.onreconnected(() => {
			if (disposed) return;
			connection.invoke("Register", userId).catch(console.error);
			invalidateNotifications();
		});

		(async () => {
			try {
				await connection.start();

				if (disposed || connection.state !== signalR.HubConnectionState.Connected) {
					console.warn("[SignalR] Connection was disposed or not connected after start.");
					return;
				}
				
				await connection.invoke("Register", userId);
			} catch (error) {
				if (disposed) {
					return;
				}
				console.error(error);
			}
		})();

		return () => {
			disposed = true;

			connection.off("notification_badge");
			connection.off("notification_created");
			connection.off("notification");

			if (connectionRef.current === connection) {
				connectionRef.current = null;
			}

			void connection.stop();
		};
	}, [accessToken, accessTokenRef, isLoading, queryClient, userId, isMounted]);

	return badge;
}
