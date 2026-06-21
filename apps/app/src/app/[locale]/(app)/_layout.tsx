import { useSession } from "@/features/auth/context";
import { NotificationProvider } from "@/features/notifications/context/notification-context";
import { useNotificationSocket } from "@/features/notifications/hooks/use-notification-socket";
import { useDecryptJWT } from "@/hooks/use-decrypt-jwt";
import { THEME } from "@/lib/theme";
import { useQueryClient } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { Tabs } from "expo-router";
import { BellIcon, HomeIcon, ListIcon, SearchIcon, UserCheck, UserCheck2, UserIcon, Users } from "lucide-react-native";
import { styled } from "nativewind";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { useTranslations } from "use-intl";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldPlaySound: false,
		shouldSetBadge: false,
		shouldShowBanner: false,
		shouldShowList: false,
	}),
});

const StyledTabs = styled(Tabs, {
	className: "screenOptions.tabBarStyle",
});

export default function AppLayout() {
	const { accessToken } = useSession();
	const userData = useDecryptJWT<{ role: "Sporter" | "Trainer" | "Admin" }>(accessToken);
	const colorScheme = useColorScheme();
	const { unreadCount } = useNotificationSocket();
	const queryClient = useQueryClient();
	const t = useTranslations("bottomTabs");

	useEffect(() => {
		if (unreadCount > 0) {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		}
	}, [unreadCount]);

	return (
		<NotificationProvider>
			<StyledTabs
				className="bg-muted border-t-0"
				screenOptions={{
					headerShown: false,
					tabBarActiveTintColor: THEME[colorScheme === "unspecified" ? "dark" : colorScheme].primary,
					tabBarInactiveTintColor: THEME[colorScheme === "unspecified" ? "dark" : colorScheme].mutedForeground,
				}}
			>
				<Tabs.Screen
					name="index"
					options={{
						title: t("home"),
						tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
					}}
				/>
				<Tabs.Screen
					name="my-plans"
					options={{
						title: t("myPlans"),
						tabBarIcon: ({ color, size }) => <ListIcon color={color} size={size} />,
					}}
				/>
				<Tabs.Screen
					name="explore"
					options={{
						title: t("explore"),
						tabBarIcon: ({ color, size }) => <SearchIcon color={color} size={size} />,
					}}
				/>
				<Tabs.Screen
					name="notifications"
					options={
						userData?.role === "Sporter" ?
							{
								title: t("notifications"),
								tabBarIcon: ({ color, size }) => <BellIcon color={color} size={size} />,
								tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
							}
						:	{ href: null }
					}
				/>
				<Tabs.Screen
					name="requests"
					options={
						userData?.role !== "Sporter" ?
							{
								title: t("requests"),
								tabBarIcon: ({ color, size }) => <UserCheck2 color={color} size={size} />,
							}
						:	{ href: null }
					}
				/>
				<Tabs.Screen
					name="profile"
					options={{
						title: t("profile"),
						tabBarIcon: ({ color, size }) => <UserIcon color={color} size={size} />,
					}}
				/>
				{/* The plans should not be directly accessible from the tab bar and only via the explore or my plans tabs */}
				<Tabs.Screen name="plans" options={{ href: null }} />
			</StyledTabs>
		</NotificationProvider>
	);
}
