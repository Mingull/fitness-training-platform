import { cn } from "@fitness/ui/lib/utils";
import * as SwitchPrimitives from "@rn-primitives/switch";
import { cva, VariantProps } from "class-variance-authority";
import { Platform } from "react-native";

const switchVariants = cva(
	cn(
		"peer group/switch relative flex shrink-0 justify-center items-start rounded-full border-2 transition-all outline-none",
		Platform.select({
			web: "after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 aria-invalid:ring-3 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-disabled:cursor-not-allowed",
		}),
	),
	{
		variants: {
			size: {
				default: "h-5 w-8.5",
				sm: "h-4 w-7",
			},
			checked: {
				true: "bg-primary border-primary",
				false: "bg-input dark:bg-input/80 border-transparent",
			},
			disabled: {
				true: "opacity-50",
				false: "",
			},
		},
		defaultVariants: {
			size: "default",
			checked: false,
			disabled: false,
		},
	},
);

const switchThumbVariants = cva(
	cn("bg-background rounded-full shadow-sm transition-transform", Platform.select({ web: "not-dark:bg-clip-padding pointer-events-none block ring-0" })),
	{
		variants: {
			size: {
				default: "size-4",
				sm: "size-3",
			},
			checked: {
				true: "translate-x-[calc(100%-8px)] dark:bg-primary-foreground",
				false: "translate-x-0 dark:bg-foreground",
			},
		},
		defaultVariants: {
			size: "default",
			checked: false,
		},
	},
);

function Switch({ className, size, checked, disabled, ...props }: React.ComponentProps<typeof SwitchPrimitives.Root> & VariantProps<typeof switchVariants>) {
	return (
		<SwitchPrimitives.Root className={cn(switchVariants({ size, checked, disabled }), className)} checked={checked} disabled={disabled} {...props}>
			<SwitchPrimitives.Thumb
				className={cn(
					// "bg-background size-4 rounded-full transition-transform",
					// Platform.select({
					// 	web: "pointer-events-none block ring-0",
					// }),
					switchThumbVariants({ size, checked }),
					checked ? "dark:bg-primary-foreground translate-x-3.5" : "dark:bg-foreground translate-x-0",
				)}
			/>
		</SwitchPrimitives.Root>
	);
}

export { Switch };
