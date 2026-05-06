import "@/global.css";
import { NAV_THEME } from "@/lib/theme";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { getLocales } from "expo-localization";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { IntlProvider } from "use-intl";
import enMessages from "../../messages/en.json";
import nlMessages from "../../messages/nl.json";

const deviceLocale = getLocales()[0];
const locale = deviceLocale?.languageCode === "nl" ? "nl" : "en";
const messages = locale === "nl" ? nlMessages : enMessages;

export default function RootLayout() {
	const colorScheme = useColorScheme();

	return (
		<SafeAreaProvider>
			<IntlProvider locale={locale} messages={messages}>
				<ThemeProvider value={NAV_THEME[colorScheme ?? "dark"]}>
					<Stack screenOptions={{ headerShown: false }} />
					<StatusBar style={colorScheme === "dark" ? "light" : "dark"} animated />
					<PortalHost />
				</ThemeProvider>
			</IntlProvider>
		</SafeAreaProvider>
	);
}
