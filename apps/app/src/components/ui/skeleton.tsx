import { cn } from "@fitness/ui/lib/utils";
import { View } from "react-native";

function Skeleton({ className, ...props }: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
	return <View data-slot="skeleton" className={cn("bg-muted animate-pulse rounded-2xl", className)} {...props} />;
}

export { Skeleton };
