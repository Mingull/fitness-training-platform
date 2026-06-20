import { cn } from "@fitness/ui/lib/utils";
import { View } from "react-native";
import { Text } from "./text";

// These components are more of a visual grouping of content, rather than a semantic grouping.
// They are used to group content together in a visually appealing way, but they do not have any semantic meaning.
// For example, a SectionGroup might be used to group together a list of exercises, but it does not have any semantic meaning that indicates that the content is related to exercises.
function SectionGroup({ className, ...props }: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
	return <View className={cn("gap-4", className)} {...props} />;
}
function Section({ className, ...props }: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
	return <View className={cn(className)} {...props} />;
}

function SectionTitle({ className, children, ...props }: React.ComponentProps<typeof Text> & React.RefAttributes<Text>) {
	return (
		<Text className={cn("text-muted-foreground text-lg font-medium", className)} {...props}>
			{children}
		</Text>
	);
}

function SectionContent({ className, ...props }: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
	return <View className={cn(className)} {...props} />;
}

export { Section, SectionContent, SectionGroup, SectionTitle };
