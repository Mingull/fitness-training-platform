import { SessionProvider } from "@/features/auth/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { IntlProvider, Locale, Messages } from "use-intl";

function Providers({
	queryClient,
	locale,
	messages,
	children,
}: React.PropsWithChildren<{ queryClient: QueryClient; locale: Locale; messages: Messages }>) {
	return (
		<SafeAreaProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<QueryClientProvider client={queryClient}>
					<SessionProvider>
						<IntlProvider locale={locale} messages={messages}>
							{children}
						</IntlProvider>
					</SessionProvider>
				</QueryClientProvider>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
}
export { Providers };
