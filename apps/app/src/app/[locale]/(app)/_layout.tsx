import { useNotificationSocket } from "@/features/notifications/hooks/use-notification-socket";
import { THEME } from "@/lib/theme";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import { BellIcon, HomeIcon, ListIcon, SearchIcon, UserIcon } from "lucide-react-native";
import { styled } from "nativewind";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

const StyledTabs = styled(Tabs, {
	className: "screenOptions.tabBarStyle",
});

export default function AppLayout() {
	const colorScheme = useColorScheme();
	const { unreadCount } = useNotificationSocket();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (unreadCount > 0) {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		}
	}, [unreadCount]);

	return (
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
					title: "Home",
					tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="plans"
				options={{
					title: "Training Plans",
					tabBarIcon: ({ color, size }) => <ListIcon color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="explore"
				options={{
					title: "Explore",
					tabBarIcon: ({ color, size }) => <SearchIcon color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="notifications"
				options={{
					title: "Notifications",
					tabBarIcon: ({ color, size }) => <BellIcon color={color} size={size} />,
					tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color, size }) => <UserIcon color={color} size={size} />,
				}}
			/>
		</StyledTabs>
	);
}
