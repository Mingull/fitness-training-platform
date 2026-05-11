import { SplashScreenController } from "@/components/splash";
import { SessionProvider, useSession } from "@/context/auth";
import "@/global.css";
import { useToasterParams } from "@/hooks/use-toast-params";
import { NAV_THEME } from "@/lib/theme";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { getLocales } from "expo-localization";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";
import { IntlProvider } from "use-intl";
import enMessages from "../../messages/en.json";
import nlMessages from "../../messages/nl.json";

const deviceLocale = getLocales()[0];
const locale = deviceLocale?.languageCode === "nl" ? "nl" : "en";
const messages = locale === "nl" ? nlMessages : enMessages;

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const { position, stackingEnabled, theme, swipeDirection, closeButton, visibleToasts, autoWiggle, richColors, invert, gap } = useToasterParams();
	return (
		<SafeAreaProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<SessionProvider>
					<IntlProvider locale={locale} messages={messages}>
						<ThemeProvider value={NAV_THEME[colorScheme ?? "dark"]}>
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
								gap={gap}
								toastOptions={{
									actionButtonStyle: {
										paddingHorizontal: 20,
									},
								}}
								pauseWhenPageIsHidden
							/>
						</ThemeProvider>
					</IntlProvider>
				</SessionProvider>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
}

// Create a new component that can access the SessionProvider context later.
function RootNavigator() {
	const { session } = useSession();
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Protected guard={!!session}>
				<Stack.Screen name="[locale]/(app)" />
			</Stack.Protected>

			<Stack.Protected guard={!session}>
				<Stack.Screen name="[locale]/index" />
				<Stack.Screen name="[locale]/sign-up" />
				<Stack.Screen name="[locale]/sign-in" />
			</Stack.Protected>
		</Stack>
	);
}
