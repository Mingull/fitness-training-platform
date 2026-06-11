import { cn } from "@fitness/ui/lib/utils";
import { useRouter } from "expo-router";
import { ChevronLeftIcon } from "lucide-react-native";
import * as React from "react";
import { ScrollView, View } from "react-native";
import { Button } from "./button";
import { FAB } from "./fab";
import { Icon } from "./icon";
import { Text } from "./text";

function Scaffold({ className, ...props }: React.ComponentProps<typeof View>) {
	return <View className={cn("bg-background relative flex-1 gap-4", className)} {...props} />;
}

function ScaffoldHeader({ className, ...props }: React.ComponentProps<typeof View>) {
	return <View className={cn("bg-card pt-safe flex-row items-center px-4 pb-4 shadow-sm", className)} {...props} />;
}

type ScaffoldBackButtonProps = Omit<React.ComponentProps<typeof Button>, "variant" | "size"> & {
	icon?: React.ComponentProps<typeof Icon>["as"];
};

function ScaffoldBackButton({ className, icon, ...props }: ScaffoldBackButtonProps) {
	const router = useRouter();
	return (
		<Button variant="ghost" size="icon" className={className} {...props} onPress={() => router.back()}>
			<Icon as={icon || ChevronLeftIcon} size={20} />
		</Button>
	);
}

function ScaffoldTitle({ className, ...props }: React.ComponentProps<typeof Text>) {
	return <Text className={cn("text-foreground text-lg font-semibold tracking-tight", className)} {...props} />;
}

function ScaffoldDescription({ className, ...props }: React.ComponentProps<typeof Text>) {
	return <Text className={cn("text-muted-foreground text-sm", className)} {...props} />;
}

function ScaffoldAddon({ className, ...props }: React.ComponentProps<typeof View>) {
	return <View className={cn("ml-auto flex-row items-center gap-2", className)} {...props} />;
}

type ScaffoldContentProps<S extends boolean> = {
	scrollable?: S;
} & React.ComponentProps<typeof ScrollView> &
	React.ComponentProps<typeof View>;

function ScaffoldContent<S extends boolean = false>({ className, scrollable, ...props }: ScaffoldContentProps<S>) {
	return scrollable ?
			<ScrollView contentContainerClassName={cn("gap-4 px-4 pb-6", className)} {...props} />
		:	<View className={cn("gap-4 px-4 pb-6", className)} {...props} />;
}

function ScaffoldFAB({ ...props }: React.ComponentProps<typeof FAB>) {
	return <FAB {...props} />;
}

export { Scaffold, ScaffoldAddon, ScaffoldBackButton, ScaffoldContent, ScaffoldDescription, ScaffoldFAB, ScaffoldHeader, ScaffoldTitle };
