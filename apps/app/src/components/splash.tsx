import { useSession } from "@/context/auth";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
	const { isLoading } = useSession();

	useEffect(() => {
		if (!isLoading) {
			SplashScreen.hide();
		}
	}, [isLoading]);

	return null;
}
