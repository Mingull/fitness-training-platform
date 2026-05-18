import { cn } from "@fitness/ui/lib/utils";
import { Platform, TextInput } from "react-native";

function Textarea({
	className,
	multiline = true,
	numberOfLines = Platform.select({ web: 2, native: 8 }), // On web, numberOfLines also determines initial height. On native, it determines the maximum height.
	placeholderClassName,
	...props
}: React.ComponentProps<typeof TextInput> & React.RefAttributes<TextInput>) {
	return (
		<TextInput
			className={cn(
				"bg-input/50 dark:bg-input text-foreground placeholder:text-muted-foreground flex min-h-16 w-full rounded-2xl border border-transparent pt-3 pr-3 pb-3 pl-3 text-base",
				Platform.select({
					web: "dark:aria-invalid:border-destructive/50 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive field-sizing-content resize-none transition-[color,box-shadow,background-color] outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm",
				}),
				props.editable === false && "opacity-50",
				className,
			)}
			placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
			multiline={multiline}
			numberOfLines={numberOfLines}
			textAlignVertical="top"
			{...props}
		/>
	);
}

export { Textarea };
