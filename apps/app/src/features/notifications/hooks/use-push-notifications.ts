import { useSession } from "@/features/auth/context";
import { registerForPushNotificationsAsync } from "@/features/notifications/utils/register-for-push-notification";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useRegisterDevice } from "../hooks/use-register-device";

export function usePushNotifications() {
	const { userId } = useSession();
	const deviceMutator = useRegisterDevice();

	const [expoToken, setExpoToken] = useState<string | undefined>();
	const [error, setError] = useState<Error | undefined>(undefined);

	useEffect(() => {
		if (!userId) return;

		registerForPushNotificationsAsync()
			.then((token) => {
				if (!token) return;

				setExpoToken(token);

				deviceMutator.mutate({
					expoToken: token,
					platform:
						Platform.OS === "android" ? "android"
						: Platform.OS === "ios" ? "ios"
						: "web",
				});
			})
			.catch(setError);
	}, [userId]);

	return { expoToken, error };
}
