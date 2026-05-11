import { useSession } from "@/context/auth";
import { SplashScreen } from "expo-router";

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
	const { isLoading } = useSession();

	if (!isLoading) {
		SplashScreen.hide();
	}

	return null;
}
