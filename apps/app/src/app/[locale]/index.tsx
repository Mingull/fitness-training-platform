import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Redirect } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

export default function Index() {
	const [isSignedIn] = useState(false);

	if (!isSignedIn) {
		return <Redirect href="/[locale]/sign-up" />;
	}

	return (
		<View className="bg-background flex-1 items-center justify-center">
			<Text className="text-primary text-xl font-bold">Welcome to Nativewind!</Text>

			<Button variant={"outline"}>
				<Text>Button</Text>
			</Button>
		</View>
	);
}
