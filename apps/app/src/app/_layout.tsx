import { Providers } from "@/components/providers";
import { SplashScreenController } from "@/components/splash";
import { Toaster } from "@/components/ui/sonner";
import { useSession } from "@/features/auth/context";
import "@/globals.css";
import { NAV_THEME } from "@/lib/theme";
import "@/polyfills";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClient } from "@tanstack/react-query";
import { getCalendars, getLocales } from "expo-localization";
import { Stack, useTheme } from "expo-router";
import { ThemeProvider } from "expo-router/react-navigation";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import enMessages from "../../messages/en.json";
import nlMessages from "../../messages/nl.json";

const deviceLocale = getLocales()[0];
const locale = deviceLocale?.languageCode === "nl" ? "nl" : "en";
const messages = locale === "nl" ? nlMessages : enMessages;
const timeZone = getCalendars()[0]?.timeZone ?? "UTC";
const queryClient = new QueryClient();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	return (
		<Providers queryClient={queryClient} locale={locale} messages={messages} timeZone={timeZone}>
			<ThemeProvider value={NAV_THEME[colorScheme === "unspecified" ? "dark" : colorScheme]}>
				<SplashScreenController />
				<StatusBar style={colorScheme === "dark" ? "light" : "dark"} animated />
				<RootNavigator />
				<Toaster position="top-center" theme={colorScheme === "dark" ? "dark" : "light"} />
				<PortalHost />
			</ThemeProvider>
		</Providers>
	);
}

// Create a new component that can access the SessionProvider context later.
function RootNavigator() {
	const { isAuthenticated } = useSession();
	const theme = useTheme();
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: {
					backgroundColor: theme.colors.background,
				},
			}}
		>
			<Stack.Protected guard={isAuthenticated}>
				<Stack.Screen name="[locale]/(app)" />
			</Stack.Protected>

			<Stack.Protected guard={!isAuthenticated}>
				<Stack.Screen name="[locale]/index" />
				<Stack.Screen name="[locale]/sign-up" />
				<Stack.Screen name="[locale]/sign-in" />
			</Stack.Protected>
		</Stack>
	);
}
