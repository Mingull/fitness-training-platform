import { TextClassContext } from "@/components/ui/text";
import { cn } from "@fitness/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Platform, Pressable } from "react-native";

const buttonVariants = cva(
	cn(
		"group flex-row shrink-0 items-center justify-center rounded-4xl border border-transparent bg-clip-padding whitespace-nowrap",
		Platform.select({
			web: "transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		}),
	),
	{
		variants: {
			variant: {
				accent: cn("bg-accent aria-expanded:bg-accent/90", Platform.select({ web: "hover:bg-accent/90 focus-visible:ring-accent/30" })),
				default: cn("bg-primary", Platform.select({ web: "hover:bg-primary/80" })),
				destructive: cn(
					"bg-destructive/10 dark:bg-destructive/20",
					Platform.select({
					web: "hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
					}),
				),
				ghost: cn("aria-expanded:bg-muted", Platform.select({ web: "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50" })),
				link: "",
				outline: cn(
					"border-border bg-background aria-expanded:bg-muted dark:bg-transparent",
					Platform.select({
						web: "hover:bg-muted dark:hover:bg-input/30",
					}),
				),
				secondary: cn("bg-secondary aria-expanded:bg-secondary", Platform.select({ web: "hover:bg-secondary/80" })),
			},
			size: {
				default: "h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
				xs: cn(
					"h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
					Platform.select({ web: "[&_svg:not([class*='size-'])]:size-3" }),
				),
				sm: "h-8 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
				lg: "h-10 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
				icon: "size-9",
				"icon-xs": cn("size-6", Platform.select({ web: "[&_svg:not([class*='size-'])]:size-3" })),
				"icon-sm": "size-8",
				"icon-lg": "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

const buttonTextVariants = cva(cn("text-foreground text-sm font-medium", Platform.select({ web: "pointer-events-none transition-colors" })), {
	variants: {
		variant: {
			accent: "text-accent-foreground",
			default: "text-primary-foreground",
			destructive: "text-destructive",
			ghost: "aria-expanded:text-foreground",
			link: cn("text-primary group-active:underline", Platform.select({ web: "underline-offset-4 hover:underline group-hover:underline" })),
			outline: cn("aria-expanded:text-foreground ", Platform.select({ web: " hover:text-foreground " })),
			secondary: "text-secondary-foreground aria-expanded:text-secondary-foreground",
		},
		size: {
			default: "",
			xs: "",
			sm: "",
			lg: "",
			icon: "",
			"icon-xs": "",
			"icon-sm": "",
			"icon-lg": "",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

type ButtonProps = React.ComponentProps<typeof Pressable> & VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
	return (
		<TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
			<Pressable className={cn(props.disabled && "opacity-50", buttonVariants({ variant, size }), className)} role="button" {...props} />
		</TextClassContext.Provider>
	);
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
