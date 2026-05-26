import { Providers } from "@/components/providers";
import { SplashScreenController } from "@/components/splash";
import { useSession } from "@/features/auth/context";
import "@/globals.css";
import { useToasterParams } from "@/hooks/use-toast-params";
import { NAV_THEME } from "@/lib/theme";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClient } from "@tanstack/react-query";
import { getLocales } from "expo-localization";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, useColorScheme } from "react-native";
import { Toaster } from "sonner-native";
import enMessages from "../../messages/en.json";
import nlMessages from "../../messages/nl.json";

const deviceLocale = getLocales()[0];
const locale = deviceLocale?.languageCode === "nl" ? "nl" : "en";
const messages = locale === "nl" ? nlMessages : enMessages;
const queryClient = new QueryClient();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const { position, stackingEnabled, theme, swipeDirection, closeButton, visibleToasts, autoWiggle, richColors, invert, gap } = useToasterParams();
	return (
		<Providers queryClient={queryClient} locale={locale} messages={messages}>
			<ThemeProvider value={NAV_THEME[colorScheme === "unspecified" ? "dark" : colorScheme]}>
				<SplashScreenController />
				<StatusBar style={colorScheme === "dark" ? "light" : "dark"} animated />
				<RootNavigator />
				<PortalHost />
				<Toaster
					positionerStyle={Platform.OS === "android" ? { elevation: 999 } : undefined}
					position={position}
					swipeToDismissDirection={swipeDirection}
					visibleToasts={visibleToasts}
					closeButton={closeButton}
					autoWiggleOnUpdate={autoWiggle}
					theme={theme}
					richColors={richColors}
					invert={invert}
					enableStacking={stackingEnabled}
					gap={gap}
					toastOptions={{
						actionButtonStyle: {
							paddingHorizontal: 20,
						},
					}}
					pauseWhenPageIsHidden
				/>
			</ThemeProvider>
		</Providers>
	);
}

// Create a new component that can access the SessionProvider context later.
function RootNavigator() {
	const { isAuthenticated } = useSession();
	return (
		<Stack screenOptions={{ headerShown: false }}>
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
