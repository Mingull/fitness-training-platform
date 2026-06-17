import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { TriggerRef } from "@rn-primitives/select";
import { useRef } from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

const fruits = [
	{ label: "Apple", value: "apple" },
	{ label: "Banana", value: "banana" },
	{ label: "Blueberry", value: "blueberry" },
	{ label: "Grapes", value: "grapes" },
	{ label: "Pineapple", value: "pineapple" },
];

export default function HomeScreen() {
	const ref = useRef<TriggerRef>(null);
	const insets = useSafeAreaInsets();
	const contentInsets = {
		top: insets.top,
		bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
		left: 12,
		right: 12,
	};
	return (
		<View className="bg-background flex-1 items-center justify-center gap-2">
			<Text className="text-primary text-xl font-bold">Welcome to Nativewind!</Text>

			<View className="flex-row gap-4">
				<Button
					variant={"default"}
					onPress={() => {
						toast.success("Navigating to profile...");
					}}
				>
					<Text>Profile</Text>
				</Button>
			</View>
			<Select>
				<SelectTrigger ref={ref} className="w-45">
					<SelectValue placeholder="Select a fruit" />
				</SelectTrigger>
				<SelectContent insets={contentInsets} className="w-45">
					<SelectGroup>
						<SelectLabel>Fruits</SelectLabel>
						{fruits.map((fruit) => (
							<SelectItem key={fruit.value} label={fruit.label} value={fruit.value}>
								{fruit.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			<Select>
				<SelectTrigger ref={ref} className="w-45">
					<SelectValue placeholder="Select a fruity" />
				</SelectTrigger>
				<SelectContent insets={contentInsets} className="w-45">
					{fruits.map((fruit) => (
						<SelectItem key={fruit.value} label={fruit.label} value={fruit.value}>
							{fruit.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</View>
	);
}
