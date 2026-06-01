import { TextClassContext } from "@/components/ui/text";
import { cn } from "@fitness/ui/lib/utils";
import { Slot } from "@rn-primitives/slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Platform, View } from "react-native";

const badgeVariants = cva(
	cn(
		"group/badge inline-flex flex-row w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-3xl border border-transparent px-2 py-0.5",
		Platform.select({
			web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 whitespace-nowrap transition-all focus-visible:ring-[3px] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:pointer-events-none [&>svg]:size-3!",
		}),
	),
	{
		variants: {
			variant: {
				default: cn("bg-primary/10 border-primary/30", Platform.select({ web: "[a]:hover:bg-primary/80" })),
				secondary: cn("bg-secondary text-secondary-foreground ", Platform.select({ web: "[a]:hover:bg-secondary/80" })),
				muted: cn("bg-muted/20 border-muted", Platform.select({ web: "[a]:hover:bg-muted/80" })),
				destructive: cn(
					"bg-destructive/10 text-destructive",
					Platform.select({
						web: "focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
					}),
				),
				outline: cn("border-border text-foreground ", Platform.select({ web: "[a]:hover:bg-muted [a]:hover:text-muted-foreground" })),
				ghost: Platform.select({ web: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50" }),
				link: Platform.select({ web: "underline-offset-4 hover:underline" }),
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const badgeTextVariants = cva("text-xs font-medium", {
	variants: {
		variant: {
			default: "text-primary",
			secondary: "text-secondary-foreground",
			muted: "text-muted-foreground",
			destructive: "text-white",
			outline: "text-foreground",
			ghost: "text-muted-foreground",
			link: "text-primary",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

type BadgeProps = React.ComponentProps<typeof View> &
	React.RefAttributes<View> & {
		asChild?: boolean;
	} & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, asChild, ...props }: BadgeProps) {
	const Component = asChild ? Slot : View;
	return (
		<TextClassContext.Provider value={badgeTextVariants({ variant })}>
			<Component className={cn(badgeVariants({ variant }), className)} {...props} />
		</TextClassContext.Provider>
	);
}

export { Badge, badgeTextVariants, badgeVariants };
export type { BadgeProps };
