import { SessionProvider } from "@/features/auth/context";
import { NotificationProvider } from "@/features/notifications/context/notification-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { IntlProvider, Locale, Messages } from "use-intl";

function Providers({
	queryClient,
	locale,
	messages,
	timeZone,
	children,
}: React.PropsWithChildren<{ queryClient: QueryClient; locale: Locale; messages: Messages; timeZone: string }>) {
	return (
		<SafeAreaProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<QueryClientProvider client={queryClient}>
					<SessionProvider>
						<IntlProvider locale={locale} messages={messages} timeZone={timeZone}>
							<NotificationProvider>
								{children}
							</NotificationProvider>
						</IntlProvider>
					</SessionProvider>
				</QueryClientProvider>
			</GestureHandlerRootView>
		</SafeAreaProvider>
	);
}
export { Providers };

