import { THEME } from "@/lib/theme";
import { Tabs } from "expo-router";
import { Home, List, User } from "lucide-react-native";
import { styled } from "nativewind";
import { useColorScheme } from "react-native";

const StyledTabs = styled(Tabs, {
	className: "screenOptions.tabBarStyle",
});

export default function AppLayout() {
	const colorScheme = useColorScheme();
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
					tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="plans"
				options={{
					title: "Training Plans",
					tabBarIcon: ({ color, size }) => <List color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
				}}
			/>
		</StyledTabs>
	);
}
