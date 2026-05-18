import { useSession } from "@/features/auth/context";
import {
	JetBrainsMono_100Thin,
	JetBrainsMono_100Thin_Italic,
	JetBrainsMono_200ExtraLight,
	JetBrainsMono_200ExtraLight_Italic,
	JetBrainsMono_300Light,
	JetBrainsMono_300Light_Italic,
	JetBrainsMono_400Regular,
	JetBrainsMono_400Regular_Italic,
	JetBrainsMono_500Medium,
	JetBrainsMono_500Medium_Italic,
	JetBrainsMono_600SemiBold,
	JetBrainsMono_600SemiBold_Italic,
	JetBrainsMono_700Bold,
	JetBrainsMono_700Bold_Italic,
	JetBrainsMono_800ExtraBold,
	JetBrainsMono_800ExtraBold_Italic,
} from "@expo-google-fonts/jetbrains-mono";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
	const { isLoading } = useSession();
	const [fontsLoaded, error] = useFonts({
		JetBrainsMono_100Thin,
		JetBrainsMono_100Thin_Italic,
		JetBrainsMono_200ExtraLight,
		JetBrainsMono_200ExtraLight_Italic,
		JetBrainsMono_300Light,
		JetBrainsMono_300Light_Italic,
		JetBrainsMono_400Regular,
		JetBrainsMono_400Regular_Italic,
		JetBrainsMono_500Medium,
		JetBrainsMono_500Medium_Italic,
		JetBrainsMono_600SemiBold,
		JetBrainsMono_600SemiBold_Italic,
		JetBrainsMono_700Bold,
		JetBrainsMono_700Bold_Italic,
		JetBrainsMono_800ExtraBold,
		JetBrainsMono_800ExtraBold_Italic,
	});

	useEffect(() => {
		if (!isLoading && (fontsLoaded || error)) {
			SplashScreen.hideAsync();
		}
		// if (!isLoading) {
		// 	SplashScreen.hideAsync();
		// }
	}, [isLoading, fontsLoaded, error]);

	if (!fontsLoaded && !error) {
		return null;
	}

	return null;
}
