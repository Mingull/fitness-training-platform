import { cn } from "@fitness/ui/lib/utils";
import { Platform, TextInput, TextInputProps } from "react-native";

function Input({ className, ...props }: TextInputProps & React.RefAttributes<TextInput>) {
	return (
		<TextInput
			className={cn(
				"bg-input/50 dark:bg-input text-foreground placeholder:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 h-9 w-full min-w-0 rounded-3xl border border-transparent pt-1 pr-3 pb-1 pl-3 text-base outline-none",
				{ "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50": props.editable === false },
				Platform.select({
					web: cn(
						"file:text-foreground focus-visible:border-ring focus-visible:ring-ring/30 transition-[color,box-shadow,background-color] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-3 aria-invalid:ring-3 md:text-sm",
					),
				}),
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
